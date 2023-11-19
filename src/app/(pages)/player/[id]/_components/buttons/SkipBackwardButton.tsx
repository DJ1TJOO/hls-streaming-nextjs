"use client";

import React from "react";

import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

import { useVideoPlayer } from "../VideoPlayerProvider";

export default function SkipBackwardButton() {
    const { videoRef, registerAction } = useVideoPlayer();
    const skipBackward = registerAction("skipBackward", {
        action() {
            let video = videoRef.current;
            if (!video) return;

            video.currentTime = Math.max(video.currentTime - 10, 0);
        },
        key: "ArrowLeft",
        icon: <ArrowUturnLeftIcon className="h-5 w-5" />,
    });

    return (
        <button className="p-1.5" onClick={skipBackward}>
            <ArrowUturnLeftIcon className="h-5 w-5" />
        </button>
    );
}
