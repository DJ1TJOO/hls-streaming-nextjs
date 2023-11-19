"use client";

import React from "react";

import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";

import { useVideoPlayer } from "../VideoPlayerProvider";
import VideoPlayerButtonTransition from "../player/VideoPlayerButtonTransition";

export default function PlayPauseButton() {
    const { videoRef, registerAction } = useVideoPlayer();
    const togglePlayPause = registerAction("playPause", {
        action() {
            let video = videoRef.current;
            if (!video) return;

            if (video.paused) video.play();
            else video.pause();
        },
        key: "Space",
        icon: null,
    });

    return (
        <button className="p-1.5" onClick={togglePlayPause}>
            <VideoPlayerButtonTransition
                show={!videoRef.current?.paused}
                iconEnabled={<PauseIcon className="h-full w-full" />}
                iconDisabled={<PlayIcon className="h-full w-full" />}
            />
        </button>
    );
}
