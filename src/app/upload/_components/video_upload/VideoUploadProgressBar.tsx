"use client";

import React, { useContext } from "react";

import { VideoContext } from "./VideoProvider";

export default function VideoUploadProgressBar() {
    const { currentProgress } = useContext(VideoContext);

    return (
        <div className="h-1 w-full rounded-full bg-tertiary">
            <div
                className="h-full rounded-full bg-action transition-all duration-300"
                style={{
                    width: currentProgress * 100 + "%",
                }}
            />
        </div>
    );
}
