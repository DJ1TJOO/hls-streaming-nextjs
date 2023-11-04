"use client";

import React, { useContext } from "react";

import { VideoContext } from "./VideoProvider";

export default function VideoUploadProgressBar() {
    const { file } = useContext(VideoContext);

    return (
        <div className="h-1 w-full rounded-full bg-tertiary">
            <div
                className="h-full rounded-full bg-action transition-all duration-300"
                style={{
                    width: file ? file.upload * 100 + "%" : "0%",
                }}
            />
        </div>
    );
}
