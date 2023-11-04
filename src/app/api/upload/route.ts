import { RelativeMaster } from "@/transcode/realativeMaster";
import { Transcoder } from "@/transcode/transcoder";
import { existsSync } from "fs";
import { mkdir, rm, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
    const data = await req.formData();

    if (data.getAll("file").length < 1) {
        return NextResponse.json(
            {
                success: false,
                error: "file-not-uploaded",
            },
            {
                status: 422,
            }
        );
    }

    const relativeMaster = new RelativeMaster();
    const transcoders: { transcoder: Transcoder; file: string }[] = [];

    const dirPath = "./tmp";
    if (!existsSync(dirPath)) await mkdir(dirPath);

    for (const file of data.getAll("file")) {
        if (!(file instanceof File)) continue;

        const fileName = file.name.replaceAll(/\s+/g, "_");
        const filePath = path.join(dirPath, fileName);
        if (existsSync(filePath)) {
            // TODO: handle
            continue;
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        const outputPath = path.join(dirPath, path.parse(fileName).name);
        if (!existsSync(outputPath))
            await mkdir(outputPath, { recursive: true });
        transcoders.push({
            transcoder: new Transcoder(filePath, outputPath, relativeMaster),
            file: file.name,
        });
    }

    req.signal.addEventListener("abort", () => {
        for (const { transcoder } of transcoders) {
            transcoder.abort();
        }
    });

    let responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    new Promise<void>(async (res) => {
        try {
            await Promise.all(
                transcoders.map(
                    async ({ transcoder, file }) =>
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
                                    writer.write(
                                        encoder.encode(
                                            `${file}>${percentage.toFixed(4)}`
                                        )
                                    );
                                }
                            )
                            .then(() =>
                                writer.write(encoder.encode(`${file}>done`))
                            )
                            .catch(() => rm(transcoder.inputFilePath))
                )
            );
            await writer.close();
        } catch (error) {
        } finally {
            res();
        }
    });

    return new Response(responseStream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache, no-transform",
            "Content-Encoding": "none",
        },
    });
}
