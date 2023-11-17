"use client";

import React, { PropsWithChildren, useContext } from "react";

import { VideoContext } from "./VideoProvider";

function isNumeric(str: string) {
    return !isNaN(parseFloat(str));
}

export default function VideoUploadForm({ children }: PropsWithChildren) {
    const {
        form,
        file,
        setCancelUpload,
        setCurrentProgress,
        setCurrentError,
        currentResult,
    } = useContext(VideoContext);

    return (
        <form
            ref={form}
            onSubmit={async (e) => {
                e.preventDefault();
                if (!file) return;

                const controller = new AbortController();
                setCancelUpload(controller);

                const formData = new FormData();

                formData.append(
                    "file",
                    JSON.stringify({
                        name: file.name,
                    })
                );
                formData.append(
                    "tmdb",
                    JSON.stringify({
                        tmdb_id:
                            currentResult?.movie?.id ?? currentResult?.tv?.id,
                        tmdb_season_nr:
                            currentResult?.episode?.season_number ?? null,
                        tmdb_episode_nr:
                            currentResult?.episode?.episode_number ?? null,
                    })
                );

                try {
                    const res = await fetch("/api/upload", {
                        method: "post",
                        body: formData,
                        signal: controller.signal,
                        cache: "no-store",
                    });

                    if (res.status !== 200 || !res.body) {
                        setCancelUpload(() => null);
                        setCurrentProgress(0);
                        setCurrentError("Failed to upload");
                        return;
                    }

                    const reader = res.body
                        .pipeThrough(new TextDecoderStream())
                        .getReader();
                    setCancelUpload(reader);

                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        const parts = value.split(">");

                        if (parts.length < 2 || parts[0] !== file.name)
                            continue;

                        const command = parts[1];

                        if (command === "upload" && parts.length > 2) {
                            const token = parts[2];

                            const uploadFormData = new FormData();
                            uploadFormData.append("file", file);
                            fetch("/api/upload-file", {
                                method: "post",
                                body: uploadFormData,
                                cache: "no-store",
                                headers: {
                                    "x-upload-token": token,
                                },
                            }).then((res) => {
                                if (res.status !== 200)
                                    throw new Error("failed to upload", {
                                        cause: res,
                                    });
                            });
                        } else if (
                            command === "progress" &&
                            parts.length > 2 &&
                            isNumeric(parts[2])
                        ) {
                            setCurrentProgress(parseFloat(parts[2]));
                        } else if (command === "conflict") {
                            setCurrentProgress(0);
                            setCurrentError(
                                "The movie or episode is already uploaded"
                            );
                        } else if (command === "done") {
                            setCurrentProgress(1);
                        }
                    }

                    setCancelUpload(null);
                } catch (error) {
                    console.log(error);

                    setCancelUpload(null);
                    setCurrentProgress(0);
                    setCurrentError("Failed to upload");
                }
            }}
        >
            {children}
        </form>
    );
}
