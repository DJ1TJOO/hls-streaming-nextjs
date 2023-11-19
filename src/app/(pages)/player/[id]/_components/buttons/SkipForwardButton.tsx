"use client";

import React from "react";

import { ArrowUturnRightIcon } from "@heroicons/react/24/solid";

import { useVideoPlayer } from "../VideoPlayerProvider";

export default function SkipForwardButton() {
    const { videoRef, registerAction } = useVideoPlayer();
    const skipForward = registerAction("skipForward", {
        action() {
            let video = videoRef.current;
            if (!video) return;

            video.currentTime = Math.min(
                video.currentTime + 10,
                video.duration
            );
        },
        key: "ArrowRight",
        icon: <ArrowUturnRightIcon className="h-5 w-5" />,
    });

    return (
        <button className="p-1.5" onClick={skipForward}>
            <ArrowUturnRightIcon className="h-5 w-5" />
        </button>
    );
}
