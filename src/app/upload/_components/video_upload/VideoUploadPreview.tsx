"use client";

import React from "react";

import { formatTime } from "@/format";

import { FileUploadFile } from "../FilesProvider";

export default function VideoUploadPreview({ file }: { file: FileUploadFile }) {
    return (
        <div className="h-fit w-[14rem] min-w-[14rem] max-w-[14rem] overflow-hidden rounded-2xl bg-tertiary">
            <video
                src={file.preview}
                onLoad={(e) => {
                    URL.revokeObjectURL(file.preview);
                }}
                className="w-full"
            />
            <div className="p-3 text-sm font-bold text-text">
                {file.name}{" "}
                <span className="text-text-dark">
                    • {formatTime(file.duration)}
                </span>
            </div>
        </div>
    );
}
