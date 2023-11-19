"use client";

import React, { useEffect, useRef, useState } from "react";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import Hls from "hls.js";

import { useVideoPlayer } from "../VideoPlayerProvider";
import VolumeCard from "../player/VideoPlayerCard";

const levelNames = ["low", "medium", "high"];

export default function SettingsButton() {
    const { hls } = useVideoPlayer();

    const button = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const selectRef = useRef<HTMLSelectElement>(null);
    const [targetQuality, setTargetQuality] = useState(-1);
    const [actualQuality, setActualQuality] = useState(0);

    useEffect(() => {
        if (!hls) return;

        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
            setActualQuality(data.level);
        });

        return () => {
            hls.removeAllListeners();
        };
    }, [hls]);

    const levels = hls
        ? hls.levels.map((x, i) => ({ index: i, ...x })).sort((x) => x.width)
        : [];
    const canUseNames = levels.length <= levelNames.length;

    return (
        <>
            <button
                className={"p-1.5 outline-none"}
                ref={button}
                onClick={openModal}
            >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>

            <VolumeCard button={button} isOpen={isOpen} closeModal={closeModal}>
                {hls ? (
                    <>
                        <span className="font-medium">Quality</span>
                        <select
                            className="rounded-lg bg-primary px-2 py-1.5"
                            ref={selectRef}
                            onChange={(e) => {
                                const targetQuality = parseInt(e.target.value);
                                setTargetQuality(targetQuality);

                                // Auto
                                if (targetQuality < 0) {
                                    hls.currentLevel = -1;
                                } else {
                                    hls.currentLevel = targetQuality;
                                }
                            }}
                            value={targetQuality}
                        >
                            <option value="-1">
                                Auto (
                                {canUseNames
                                    ? levelNames[actualQuality]
                                    : levels.find(
                                          (x) => x.index === actualQuality
                                      )?.height}
                                )
                            </option>
                            {levels.map((x, i) => (
                                <option value={x.index}>
                                    {canUseNames ? levelNames[i] : x.height}
                                </option>
                            ))}
                        </select>
                    </>
                ) : null}
            </VolumeCard>
        </>
    );
}
