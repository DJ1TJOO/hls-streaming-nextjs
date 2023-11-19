"use client";

import React, { useState } from "react";

import { formatTimePlayer, formatTimePlayerActual } from "@/format";

import { useVideoPlayer } from "../VideoPlayerProvider";
import { useInterval } from "../useInterval";

type TimeFormat = "video" | "actual";

export default function VideoPlayerTime() {
    const { videoRef } = useVideoPlayer();
    const [timeFormat, setTimeFormat] = useState<TimeFormat>("video");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    function toggleTimeFormat() {
        setTimeFormat((prev) => (prev === "actual" ? "video" : "actual"));
    }

    useInterval(1000, () => {
        let video = videoRef.current;
        if (!video) return;

        const date = new Date();
        setCurrentDate(date);

        const newDate = new Date(
            date.getTime() + (video.duration - video.currentTime) * 1000
        );
        setEndDate((prev) => {
            const diff = Math.abs(prev.getTime() - newDate.getTime());
            if (diff < 500) return prev;
            return newDate;
        });
    });

    return (
        <span
            className="cursor-pointer tabular-nums"
            onClick={toggleTimeFormat}
        >
            {timeFormat === "video"
                ? formatTimePlayer(
                      videoRef.current?.currentTime ?? 0,
                      videoRef.current?.duration ?? 0
                  )
                : formatTimePlayerActual(currentDate, endDate)}
        </span>
    );
}
