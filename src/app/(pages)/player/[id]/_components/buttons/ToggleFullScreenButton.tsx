"use client";

import React, { useState } from "react";

import ExitFullScreenIcon from "@/app/_components/icons/24/outline/ExitFullScreenIcon";
import FullScreenIcon from "@/app/_components/icons/24/outline/FullScreenIcon";

import { useVideoPlayer } from "../VideoPlayerProvider";
import VideoPlayerButtonTransition from "../player/VideoPlayerButtonTransition";

export default function ToggleFullScreenButton() {
    const { registerAction } = useVideoPlayer();
    const [isFullScreen, setIsFullScreen] = useState(false);
    const toggleFullScreenButton = registerAction("toggleFullScreenButton", {
        action() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                setIsFullScreen(true);
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        },
        key: "KeyF",
        icon: null,
    });

    return (
        <button className="p-1.5" onClick={toggleFullScreenButton}>
            <VideoPlayerButtonTransition
                show={!isFullScreen}
                iconEnabled={<FullScreenIcon className="h-full w-full" />}
                iconDisabled={<ExitFullScreenIcon className="h-full w-full" />}
            />
        </button>
    );
}
