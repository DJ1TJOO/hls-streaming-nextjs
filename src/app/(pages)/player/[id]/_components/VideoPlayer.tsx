"use client";

import React, { useCallback, useState } from "react";
import { useEffect, useRef } from "react";

import {
    BackwardIcon,
    ForwardIcon,
    PauseIcon,
    PlayIcon,
    Squares2X2Icon,
} from "@heroicons/react/24/solid";
import Hls from "hls.js";

import { VideoPlayerProvider, useActionRegistry } from "./VideoPlayerProvider";
import PlayPauseButton from "./buttons/PlayPauseButton";
import SettingsButton from "./buttons/SettingsButton";
import SkipBackwardButton from "./buttons/SkipBackwardButton";
import SkipForwardButton from "./buttons/SkipForwardButton";
import ToggleFullScreenButton from "./buttons/ToggleFullScreenButton";
import VolumeButton from "./buttons/VolumeButton";
import VideoPlayerActionIcon, {
    useActionIcon,
} from "./player/VideoPlayerAction";
import VideoPlayerProgress from "./player/VideoPlayerProgress";
import VideoPlayerTime from "./player/VideoPlayerTime";

export default function VideoPlayer({ url }: { url: string }) {
    function showAction(id: string) {
        const action = registry[id];
        if (typeof action === "undefined") return;

        if (action.icon) {
            actionIcon.showActionIcon(action.icon);
        }

        action.action();
    }

    const videoRef = useRef<HTMLVideoElement>(null);
    const [hls, setHls] = useState<Hls | null>(null);
    const [registry, registerAction] = useActionRegistry(showAction);
    const actionIcon = useActionIcon();

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const actions = Object.keys(registry).filter(
                (x) => registry[x].key === e.code
            );
            for (const action of actions) {
                showAction(action);
            }
        },
        [registry]
    );

    function handleKeyUp(e: KeyboardEvent) {
        if (e.code === "Space") e.preventDefault();
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Load hls video
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
            return;
        }

        if (!Hls.isSupported()) {
            console.error(
                "This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API"
            );
            return;
        }

        const hls = new Hls();
        setHls(hls);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
        });

        hls.loadSource(url);
        hls.attachMedia(video);

        return () => {
            hls.removeAllListeners();
        };
    }, [url, videoRef.current]);

    return (
        <VideoPlayerProvider
            value={{
                videoRef,
                registerAction,
                hls,
            }}
        >
            <div
                onClick={() => showAction("playPause")}
                className="relative flex h-screen w-screen items-center overflow-hidden bg-black"
            >
                <video
                    className="max-h-full w-full"
                    ref={videoRef}
                    onPlay={() => {
                        actionIcon.showActionIcon(
                            <PlayIcon className="h-5 w-5" />
                        );
                    }}
                    onPause={() => {
                        actionIcon.showActionIcon(
                            <PauseIcon className="h-5 w-5" />
                        );
                    }}
                />
                <VideoPlayerActionIcon {...actionIcon} />
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="absolute bottom-0 left-0 z-20 flex w-full flex-col gap-3 bg-gradient-to-t from-black p-3"
                >
                    <div className="flex w-full items-center justify-between gap-3 text-text/50">
                        <div className="flex w-full items-center gap-3">
                            <BackwardIcon className="h-5 w-5" />
                            <Squares2X2Icon className="h-5 w-5" />
                            <ForwardIcon className="h-5 w-5" />
                            <VideoPlayerTime />
                        </div>
                        <div className="flex w-full items-center justify-center">
                            <SkipBackwardButton />
                            <PlayPauseButton />
                            <SkipForwardButton />
                        </div>
                        <div className="flex w-full items-center justify-end">
                            <VolumeButton
                                showActionIcon={actionIcon.showActionIcon}
                            />
                            <SettingsButton />
                            <ToggleFullScreenButton />
                        </div>
                    </div>
                    <VideoPlayerProgress />
                </div>
            </div>
        </VideoPlayerProvider>
    );
}
