import { RelativeMaster } from "@/transcode/realativeMaster";
import { Transcoder } from "@/transcode/transcoder";
import { existsSync } from "fs";
import { mkdir, rm, writeFile } from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";

import insert from "./insert";
import { ValidatedSearchResult } from "./validate";

export default async function (
    req: NextRequest,
    dirPath: string,
    tmdbApiKey: string,
    entries: {
        file: File;
        tmdb: ValidatedSearchResult;
    }[]
) {
    const transcoders: Transcoder[] = [];
    req.signal.addEventListener("abort", () => {
        for (const transcoder of transcoders) {
            transcoder.abort();
        }
    });

    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    Promise.all(
        entries.map(
            handleTranscode.bind(
                null,
                dirPath,
                tmdbApiKey,
                transcoders,
                (message) => writer.write(encoder.encode(message))
            )
        )
    )
        .then(() => writer.close())
        .catch(() => {});

    return new Response(responseStream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache, no-transform",
            "Content-Encoding": "none",
        },
    });
}

async function handleTranscode(
    dirPath: string,
    tmdbApiKey: string,
    transcoders: Transcoder[],
    write: (message: string) => void,
    { file, tmdb }: { file: File; tmdb: ValidatedSearchResult }
) {
    const video = await insert(tmdbApiKey, tmdb);
    if (video === null) {
        write(`${file}>conflict`);
        return;
    }

    // Write file
    const fileName = file.name.replaceAll(/\s+/g, "_");
    const outputPath = path.join(dirPath, video.id);
    const filePath = path.join(outputPath, fileName);
    if (!existsSync(outputPath)) await mkdir(outputPath, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Transcode
    const transcoder = new Transcoder(
        filePath,
        outputPath,
        new RelativeMaster()
    );
    transcoders.push(transcoder);

    await transcoder
        .transcode(
            [
                {
                    name: "720p",
                    width: 1280,
                    rate: 3,
                },
                {
                    name: "360p",
                    width: 480,
                    rate: 1,
                    audio: 48,
                },
            ],
            "1080p",
            5,
            96,
            (percentage) => {
                write(`${file}>progess>${percentage.toFixed(4)}`);
            }
        )
        .then(() => write(`${file}>done`))
        .catch(() => rm(transcoder.inputFilePath));
}
