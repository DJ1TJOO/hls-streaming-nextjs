"use client";

import React, { useContext } from "react";

import { formatTime } from "@/format";

import { VideoContext } from "./VideoProvider";

export default function VideoUploadPreview() {
    const { file } = useContext(VideoContext);

    return (
        <div className="h-fit w-[14rem] min-w-[14rem] max-w-[14rem] overflow-hidden rounded-2xl bg-tertiary">
            <video
                src={file?.preview}
                onLoadedMetadata={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.currentTime = Math.min(video.duration, 60 * 3);
                }}
                onTimeUpdate={() => {
                    file && URL.revokeObjectURL(file.preview);
                }}
                className="w-full"
            />
            <div className="break-words p-3 text-sm font-bold text-text">
                {file?.name}{" "}
                <span className="text-text-dark">
                    • {formatTime(file?.duration ?? 0)}
                </span>
            </div>
        </div>
    );
}
