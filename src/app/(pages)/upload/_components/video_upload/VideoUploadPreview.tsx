"use client";

import React, { useContext, useRef, useState } from "react";

import { formatTime } from "@/format";
import Image from "next/image";

import { VideoContext } from "./VideoProvider";

export default function VideoUploadPreview() {
    const { file } = useContext(VideoContext);
    const [image, setImage] = useState<{
        url: string;
        width: number;
        height: number;
    } | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    return (
        <div className="h-fit w-full overflow-hidden rounded-b-lg rounded-t-2xl bg-tertiary sm:w-[14rem] sm:min-w-[14rem] sm:max-w-[14rem]">
            {image ? (
                <Image
                    src={image.url}
                    width={image.width}
                    height={image.height}
                    className="w-full"
                    alt={"preview"}
                />
            ) : (
                <>
                    <video
                        preload="none"
                        src={file?.preview}
                        onLoadedMetadata={(e) => {
                            const video = e.target as HTMLVideoElement;
                            video.currentTime = Math.min(
                                video.duration / 2,
                                60 * 3
                            );
                        }}
                        onTimeUpdate={(e) => {
                            const video = e.target as HTMLVideoElement;
                            if (canvasRef.current) {
                                const canvas = canvasRef.current;
                                canvas.width = video.videoWidth;
                                canvas.height = video.videoHeight;

                                const ctx = canvas.getContext("2d");
                                if (ctx) {
                                    ctx.drawImage(
                                        video,
                                        0,
                                        0,
                                        canvas.width,
                                        canvas.height
                                    );
                                    setImage({
                                        url: canvas.toDataURL(),
                                        width: canvas.width,
                                        height: canvas.height,
                                    });
                                }
                            }
                        }}
                        className="hidden"
                    />
                    <canvas ref={canvasRef} className="w-full" />
                </>
            )}
            <div className="break-words p-3 text-sm font-bold text-text">
                {file?.name}{" "}
                <span className="text-text-dark">
                    • {formatTime(file?.duration ?? 0)}
                </span>
            </div>
        </div>
    );
}
