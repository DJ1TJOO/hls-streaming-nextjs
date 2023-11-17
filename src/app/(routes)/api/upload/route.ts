import { formatName } from "@/format";
import { removeEmptyDirectories } from "@/removeEmptyDirectories";
import { RelativeMaster } from "@/transcode/realativeMaster";
import { getStoreDirectory } from "@/transcode/store";
import { Transcoder } from "@/transcode/transcoder";
import ffmpeg from "fluent-ffmpeg";
import { existsSync } from "fs";
import { mkdir, rename, rm } from "fs/promises";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

import insert from "./insert";
import parse from "./parse";
import { remove } from "./remove";
import {
    createCancelledMessage,
    createConflictMessage,
    createDoneMessage,
    createProgressMessage,
    createStream,
    createUploadMessage,
    mapAsync,
} from "./stream";

export async function POST(req: NextRequest) {
    const data = await req.formData();

    // Parse
    const entries = await parse(data);
    if (entries === null) {
        return NextResponse.json(
            {
                success: false,
                error: "formdata-not-valid",
            },
            {
                status: 422,
            }
        );
    }

    // Require store path and tmdb api key
    const dirPath = process.env.UPLOAD_URL;
    const tmdbApiKey = process.env.TMDB_API_KEY;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (
        typeof dirPath === "undefined" ||
        typeof tmdbApiKey === "undefined" ||
        typeof jwtSecretKey === "undefined"
    ) {
        return NextResponse.json(
            {
                success: false,
                error: "internal-server-error",
            },
            {
                status: 500,
            }
        );
    }
    if (!existsSync(dirPath)) await mkdir(dirPath);

    // Abort handler
    let aborted = false;
    const aborts: (() => void)[] = [];
    const registerAbort = (abort: (typeof aborts)[number]) =>
        aborts.push(abort);
    const abort = () => {
        aborted = true;

        for (const abort of aborts) {
            abort();
        }
    };
    req.signal.addEventListener("abort", abort);

    // Create stream
    const stream = await createStream(abort);

    mapAsync(entries, async ({ tmdb, fileName }) => {
        const video = await insert(tmdbApiKey, tmdb);

        if (video === null) {
            await stream.write(createConflictMessage(fileName));
            return;
        }

        // When aborted remove video
        registerAbort(remove.bind(null, video));

        // Create file path
        const parsedFileName = path.parse(fileName);
        const outputFileName =
            formatName(parsedFileName.name) + parsedFileName.ext;
        const outputPath = getStoreDirectory(dirPath, video);
        const filePath = path.join(outputPath, outputFileName);
        if (!existsSync(outputPath))
            await mkdir(outputPath, { recursive: true });

        // Generate upload key
        const token = jwt.sign({ filePath }, jwtSecretKey, {
            expiresIn: "1m",
        });
        await stream.write(createUploadMessage(fileName, token));

        // Wait for file to write limit to 2 min
        const uploaded = await Promise.race([
            new Promise<boolean>(async (res) => {
                const tmp = filePath + "-tmp";
                let renamed = false;
                while (!renamed) {
                    try {
                        await rename(filePath, tmp);
                        await rename(tmp, filePath);
                        renamed = true;
                    } catch (err) {
                        renamed = false;
                    }
                }

                res(true);
            }),
            new Promise<boolean>((resolve) =>
                setTimeout(() => resolve(false), 1000 * 60 * 2)
            ),
        ]);

        if (!uploaded) {
            await stream.write(createCancelledMessage(fileName));
            await remove(video);
            await rm(outputPath, {
                recursive: true,
                force: true,
            });
            await removeEmptyDirectories(dirPath);
            return;
        }

        if (aborted) {
            await rm(outputPath, {
                recursive: true,
                force: true,
            });
            await removeEmptyDirectories(dirPath);
            return;
        }

        // Transcode
        const transcoder = new Transcoder(
            filePath,
            outputPath,
            new RelativeMaster()
        );
        registerAbort(() => transcoder.abort());

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
            .transcode(qualities, originalName, 5, 96, (progress) => {
                stream.write(createProgressMessage(fileName, progress));
            })
            .then(() => stream.write(createDoneMessage(fileName)))
            .catch(async (e) => {
                // Transcoding error so also remove from db
                if (e !== "aborted") {
                    await stream.write(createCancelledMessage(fileName));
                    await remove(video);
                }

                await rm(outputPath, {
                    recursive: true,
                    force: true,
                });
                await removeEmptyDirectories(dirPath);
            });
    })
        .then(() => stream.close())
        .catch(() => {});

    return stream.response;
}
