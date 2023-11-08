import prisma from "@/db";
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
    const abortInserted: (() => Promise<void>)[] = [];
    req.signal.addEventListener("abort", () => {
        for (const transcoder of transcoders) {
            transcoder.abort();
        }

        for (const abort of abortInserted) {
            abort();
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
                (message) => writer.write(encoder.encode(message)),
                (cb) => abortInserted.push(cb)
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
    registerAbortInserted: (cb: () => Promise<void>) => void,
    { file, tmdb }: { file: File; tmdb: ValidatedSearchResult }
) {
    const video = await insert(tmdbApiKey, tmdb);

    if (video === null) {
        write(`${file.name}>conflict`);
        return;
    }

    registerAbortInserted(async () => {
        await prisma.video.delete({
            where: {
                id: video.id,
            },
        });

        // Delete season and serie/collection if not used by others
        try {
            if (video.tmdb_season_nr !== null && video.tmdb_serie_id !== null) {
                await prisma.season.delete({
                    where: {
                        tmdb_serie_id_tmdb_season_nr: {
                            tmdb_serie_id: video.tmdb_serie_id,
                            tmdb_season_nr: video.tmdb_season_nr,
                        },
                    },
                });
                await prisma.serie.delete({
                    where: {
                        tmdb_id: video.tmdb_serie_id,
                    },
                });
            }
        } catch (error) {}

        try {
            if (video.tmdb_collection_id !== null) {
                await prisma.collection.delete({
                    where: {
                        tmdb_id: video.tmdb_collection_id,
                    },
                });
            }
        } catch (error) {}
    });

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
                write(`${file.name}>progress>${percentage.toFixed(4)}`);
            }
        )
        .then(() => write(`${file.name}>done`))
        .catch(() => rm(transcoder.inputFilePath));
}
