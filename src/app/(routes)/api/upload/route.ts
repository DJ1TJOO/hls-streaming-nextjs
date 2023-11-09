import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

import parse from "./parse";
import transcode from "./transcode";

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
    if (typeof dirPath === "undefined" || typeof tmdbApiKey === "undefined") {
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

    // Transcode
    return transcode(req, dirPath, tmdbApiKey, entries);
}
