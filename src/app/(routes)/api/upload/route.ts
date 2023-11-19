import { formatName } from "@/format";
import { removeEmptyDirectories } from "@/removeEmptyDirectories";
import { RelativeMaster } from "@/transcode/realativeMaster";
import { getStoreDirectory } from "@/transcode/store";
import { Transcoder } from "@/transcode/transcoder";
import { existsSync } from "fs";
import { mkdir, rm } from "fs/promises";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

import { createAbortHandler } from "./abort";
import { isFileUploaded } from "./file-uploader";
import insert from "./insert";
import parse from "./parse";
import { getQualities } from "./qualities";
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
    // Abort handler
    const { abort, registerAbort, unregisterAborts } =
        await createAbortHandler(req);

    // Get data
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

    // Create stream
    const stream = await createStream(abort);

    mapAsync(entries, async ({ tmdb, fileName }) => {
        try {
            const video = await insert(tmdbApiKey, tmdb);

            if (video === null) {
                await stream.write(createConflictMessage(fileName));
                return;
            }

            // When aborted remove video
            if (!(await registerAbort(fileName, remove.bind(null, video))))
                return;

            // Create file path
            const parsedFileName = path.parse(fileName);
            const outputFileName =
                formatName(parsedFileName.name) + parsedFileName.ext;
            const outputPath = getStoreDirectory(dirPath, video);
            const filePath = path.join(outputPath, outputFileName);
            const uploadFilePath = path.join(outputPath, "uploaded");

            // Generate upload key
            const token = jwt.sign({ filePath }, jwtSecretKey, {
                expiresIn: "20s",
            });
            await stream.write(createUploadMessage(fileName, token));

            // Wait for file to write limit to 2 min
            if (!(await isFileUploaded(uploadFilePath, 1000 * 60 * 2))) {
                await stream.write(createCancelledMessage(fileName));
                await removeEmptyDirectories(dirPath);
                await unregisterAborts(fileName);
                return;
            }

            // Remove uploaded file if aborted
            if (
                !(await registerAbort(fileName, async () => {
                    await rm(outputPath, {
                        recursive: true,
                        force: true,
                    });
                    await removeEmptyDirectories(dirPath);
                }))
            )
                return;

            // Transcode
            const transcoder = new Transcoder(
                filePath,
                outputPath,
                new RelativeMaster()
            );
            if (!registerAbort(fileName, async () => transcoder.abort()))
                return;

            // Find best quality
            const { qualities, originalName } = await getQualities(filePath);

            await transcoder
                .transcode(qualities, originalName, 5, 96, (progress) => {
                    stream.write(createProgressMessage(fileName, progress));
                })
                .then(async () => {
                    await unregisterAborts(fileName);
                    stream.write(createDoneMessage(fileName));
                })
                .catch(async (e) => {
                    // Transcoding error so also remove completely
                    if (e !== "aborted") {
                        await stream.write(createCancelledMessage(fileName));
                        await unregisterAborts(fileName, true);
                    }
                });
        } catch (error) {
            await stream.write(createCancelledMessage(fileName));
            await unregisterAborts(fileName, true);
        }
    })
        .then(() => stream.close())
        .catch(() => {});

    return stream.response;
}
