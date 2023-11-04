"use client";

import React from "react";

import { FileUploadFile } from "../FilesProvider";

export default function VideoUploadProgressBar({
    file,
}: {
    file: FileUploadFile;
}) {
    return (
        <div className="h-1 w-full rounded-full bg-tertiary">
            <div
                className="h-full rounded-full bg-action transition-all duration-300"
                style={{
                    width: file.upload * 100 + "%",
                }}
            />
        </div>
    );
}
