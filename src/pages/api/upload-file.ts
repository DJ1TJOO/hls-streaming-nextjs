import formidable from "formidable";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    },
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
    // Require store path and tmdb api key
    const dirPath = process.env.UPLOAD_URL;
    const tmdbApiKey = process.env.TMDB_API_KEY;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (
        typeof dirPath === "undefined" ||
        typeof tmdbApiKey === "undefined" ||
        typeof jwtSecretKey === "undefined"
    ) {
        return res.status(500).json({
            success: false,
            error: "internal-server-error",
        });
    }
    if (!existsSync(dirPath)) await mkdir(dirPath);

    // Validate token
    const token = req.headers["x-upload-token"] as string | undefined;
    if (typeof token === "undefined") {
        return res.status(401).json({
            success: false,
            error: "unauthorized",
        });
    }

    let filePath = null;
    try {
        const decoded = (await jwt.verify(token, jwtSecretKey)) as JwtPayload;
        filePath = decoded.filePath as string;
    } catch (error) {
        return res.status(403).json({
            success: false,
            error: "forbidden",
        });
    }

    const outputDir = path.parse(filePath).dir;
    if (!existsSync(outputDir)) await mkdir(outputDir, { recursive: true });
    const fileName = path.parse(filePath).base;

    const form = formidable({
        uploadDir: outputDir,
        maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB,
        filename(name, ext, part, form) {
            return fileName;
        },
        keepExtensions: true,
    });
    try {
        await form.parse(req);
        await writeFile(path.join(outputDir, "uploaded"), "1", "utf-8");
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal-server-error",
        });
    }

    res.status(200).send({
        success: true,
    });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") res.status(404).send("");
    return await post(req, res);
};
