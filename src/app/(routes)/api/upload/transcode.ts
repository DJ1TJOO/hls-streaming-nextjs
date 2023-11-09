import prisma from "@/db";
import { formatName } from "@/format";
import { extractName, prepareFileName } from "@/tmdb/extractor";
import { RelativeMaster } from "@/transcode/realativeMaster";
import { getStoreDirectory } from "@/transcode/store";
import { Transcoder } from "@/transcode/transcoder";
import ffmpeg from "fluent-ffmpeg";
import { existsSync } from "fs";
import { mkdir, rm, writeFile } from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";

import insert from "./insert";
import { ValidatedSearchResult } from "./validate";

export default async function transcode(
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
    const parsedFileName = path.parse(file.name);
    const fileName = formatName(parsedFileName.name) + parsedFileName.ext;
    const outputPath = getStoreDirectory(dirPath, video);
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

    const bestStream = await new Promise<
        | (ffmpeg.FfprobeData["streams"][0] & {
              width: number;
              height: number;
          })
        | undefined
    >((resolve) => {
        ffmpeg.ffprobe(filePath, (err, data) => {
            resolve(
                (
                    data.streams.filter(
                        (x) =>
                            x.codec_type === "video" &&
                            typeof x.width !== "undefined" &&
                            typeof x.height !== "undefined"
                    ) as ((typeof data)["streams"][0] & {
                        width: number;
                        height: number;
                    })[]
                ).sort((a, b) => b.width - a.width)[0]
            );
        });
    });

    let qualities = [
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
    ];

    let originalName = "1080p";
    if (bestStream) {
        qualities = qualities.filter((x) => x.width < bestStream.width);
        if (bestStream.width <= 1280 && bestStream.width > 480) {
            originalName = "720p";
        } else if (bestStream.width <= 480) {
            originalName = "360p";
        }
    }

    await transcoder
        .transcode(qualities, originalName, 5, 96, (percentage) => {
            write(`${file.name}>progress>${percentage.toFixed(4)}`);
        })
        .then(() => write(`${file.name}>done`))
        .catch(() => rm(transcoder.inputFilePath));
}
