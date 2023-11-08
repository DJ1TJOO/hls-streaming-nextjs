import { statSync } from "fs";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { ReadableOptions } from "stream";

const allowedExtenstions = [".m3u8", ".ts"];

function streamFile(
    path: string,
    options?: ReadableOptions
): ReadableStream<Uint8Array> {
    const downloadStream = fs.createReadStream(path, options);

    return new ReadableStream({
        start(controller) {
            downloadStream.on("data", (chunk: Buffer) =>
                controller.enqueue(new Uint8Array(chunk))
            );
            downloadStream.on("end", () => controller.close());
            downloadStream.on("error", (error: NodeJS.ErrnoException) =>
                controller.error(error)
            );
        },
        cancel() {
            downloadStream.destroy();
        },
    });
}

export async function GET(
    req: NextRequest,
    { params }: { params: { serve: string[] } }
) {
    const serve = params.serve;

    // Only allow videos access
    if (serve.length < 1 || serve[0] !== "videos") {
        return NextResponse.json(
            { success: false, error: "not-found" },
            { status: 404 }
        );
    }

    const filePath = path.join(...serve);
    if (!allowedExtenstions.includes(path.parse(filePath).ext)) {
        return NextResponse.json(
            { success: false, error: "forbidden" },
            { status: 403 }
        );
    }

    const stats = statSync(filePath);

    const data: ReadableStream<Uint8Array> = streamFile(filePath);
    const res = new NextResponse(data, {
        status: 200,
        headers: new Headers({
            "content-disposition": `attachment; filename=${path.basename(
                filePath
            )}`,
            "content-type": "application/iso",
            "content-length": stats.size + "",
        }),
    });

    return res;
}
