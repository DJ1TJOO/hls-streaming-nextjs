"use client";

import React, { useRef, useState } from "react";

import SpeakerWaveMediumIcon from "@/app/_components/icons/24/solid/SpeakerWaveMediumIcon";
import {
    MinusIcon,
    PlusIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";

import { useVideoPlayer } from "../VideoPlayerProvider";
import { useActionIcon } from "../player/VideoPlayerAction";
import VolumeCard from "../player/VideoPlayerCard";

export default function VolumeButton({
    showActionIcon,
}: {
    showActionIcon: ReturnType<typeof useActionIcon>["showActionIcon"];
}) {
    const { videoRef, registerAction } = useVideoPlayer();

    const button = useRef<HTMLButtonElement>(null);
    const [mouseDown, setMouseDown] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    function showVolumeAction(volume: number) {
        showActionIcon(<VolumeIcon volume={volume} />);
    }

    function setVolume(volume: number) {
        let video = videoRef.current;
        if (!video) return;

        const newVolume = Math.min(Math.max(volume, 0), 1);
        if (newVolume === video.volume) return;

        video.volume = newVolume;
        showVolumeAction(newVolume);
    }

    function increaseVolume(volume: number) {
        let video = videoRef.current;
        if (!video) return;

        setVolume(volume + video.volume);
    }

    const muteAction = registerAction("toggleMute", {
        action() {
            let video = videoRef.current;
            if (!video) return;

            video.muted = !video.muted;
            if (video.muted) {
                showVolumeAction(0);
            } else {
                showVolumeAction(video.volume || 0.1);
            }
        },
        key: "KeyM",
        icon: null,
    });

    const increaseAction = registerAction("increaseVolume", {
        action() {
            let video = videoRef.current;
            if (!video) return;

            if (video.muted) {
                video.muted = false;
            }

            increaseVolume(0.1);
        },
        key: "ArrowUp",
        icon: null,
    });

    const decreaseAction = registerAction("decreaseVolume", {
        action() {
            increaseVolume(-0.1);
        },
        key: "ArrowDown",
        icon: null,
    });

    function updateVolume(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.stopPropagation();

        const progressbar = e.target as HTMLDivElement;
        const video = videoRef.current;
        if (!progressbar || !video) return;

        const boundingBox = progressbar.getBoundingClientRect();
        const distance = e.pageX - boundingBox.x;
        const progress = distance / boundingBox.width;

        setVolume(progress);
    }

    return (
        <>
            <button
                className={"p-1.5 outline-none"}
                ref={button}
                onClick={openModal}
            >
                <VolumeIcon
                    volume={
                        videoRef.current?.muted
                            ? 0
                            : videoRef.current?.volume ?? 1
                    }
                />
            </button>

            <VolumeCard button={button} isOpen={isOpen} closeModal={closeModal}>
                <span className="font-medium">Volume</span>
                <div className="flex w-full items-center gap-1">
                    <button
                        onClick={muteAction}
                        className="rounded-lg bg-primary p-1"
                    >
                        <VolumeIcon volume={videoRef.current?.muted ? 0 : 1} />
                    </button>
                    <button
                        onClick={decreaseAction}
                        className="rounded-lg bg-primary p-1"
                    >
                        <MinusIcon className="h-5 w-5" />
                    </button>
                    <div
                        className="relative h-1.5 w-full py-3"
                        onMouseDown={(e) => {
                            setMouseDown(true);
                            updateVolume(e);
                        }}
                        onMouseLeave={(e) => {
                            setMouseDown(false);
                        }}
                        onMouseUp={(e) => {
                            setMouseDown(false);
                        }}
                        onMouseMove={(e) => {
                            if (!mouseDown) return;
                            updateVolume(e);
                        }}
                    >
                        <div className="pointer-events-none absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-tertiary" />
                        <div
                            className="pointer-events-none absolute top-1/2 z-10 h-1.5 -translate-y-1/2 rounded-full bg-action transition-all"
                            style={{
                                width:
                                    (videoRef.current?.volume ?? 0) * 100 + "%",
                            }}
                        />
                    </div>
                    <button
                        onClick={increaseAction}
                        className="rounded-lg bg-primary p-1"
                    >
                        <PlusIcon className="h-5 w-5" />
                    </button>
                </div>
            </VolumeCard>
        </>
    );
}

function VolumeIcon({ volume }: { volume: number }) {
    if (volume > 0.75) return <SpeakerWaveIcon className="h-5 w-5" />;
    if (volume > 0) return <SpeakerWaveMediumIcon className="h-5 w-5" />;
    return <SpeakerXMarkIcon className="h-5 w-5" />;
}
