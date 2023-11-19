"use client";

import React, { useCallback, useEffect, useState } from "react";

import { useVideoPlayer } from "../VideoPlayerProvider";

export default function VideoPlayerProgress() {
    const { videoRef } = useVideoPlayer();

    const [videoBufferedStart, setVideoBufferedStart] = useState(0);
    const [videoBufferedEnd, setVideoBufferedEnd] = useState(0);
    const [mouseDown, setMouseDown] = useState(false);

    const onTimeUpdate = useCallback(() => {
        let video = videoRef.current;
        if (!video) return;

        let bufferMin = 0;
        let bufferMax = 0;
        for (let i = 0; i < video.buffered.length; i++) {
            const start = video.buffered.start(i);
            const end = video.buffered.end(i);

            if (start < bufferMin) bufferMin = start;
            if (end > bufferMax) bufferMax = end;
        }

        setVideoBufferedStart(bufferMin);
        setVideoBufferedEnd(bufferMax);
    }, [videoRef.current]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.addEventListener("timeupdate", onTimeUpdate);

        return () => {
            video.removeEventListener("timeupdate", onTimeUpdate);
        };
    }, [onTimeUpdate]);

    function updateProgress(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.stopPropagation();

        const progressbar = e.target as HTMLDivElement;
        const video = videoRef.current;
        if (!progressbar || !video) return;

        const boundingBox = progressbar.getBoundingClientRect();
        const distance = e.pageX - boundingBox.x;
        const progress = distance / boundingBox.width;

        video.currentTime = progress * video.duration;
    }

    return (
        <div
            className="relative h-1.5 w-full py-2"
            onMouseDown={(e) => {
                setMouseDown(true);
                updateProgress(e);
            }}
            onMouseLeave={(e) => {
                setMouseDown(false);
            }}
            onMouseUp={(e) => {
                setMouseDown(false);
            }}
            onMouseMove={(e) => {
                if (!mouseDown) return;
                updateProgress(e);
            }}
        >
            <div className="pointer-events-none absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-primary" />
            <div
                className="pointer-events-none absolute top-1/2 z-10 h-1.5 -translate-y-1/2 rounded-full bg-action transition-all"
                style={{
                    width:
                        ((videoRef.current?.currentTime ?? 0) /
                            (videoRef.current?.duration ?? 0)) *
                            100 +
                        "%",
                }}
            />
            <div
                className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-secondairy transition-all duration-200"
                style={{
                    left:
                        (videoBufferedStart /
                            (videoRef.current?.duration ?? 0)) *
                            100 +
                        "%",
                    right:
                        100 -
                        (videoBufferedEnd / (videoRef.current?.duration ?? 0)) *
                            100 +
                        "%",
                }}
            />
        </div>
    );
}
