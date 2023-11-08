"use client";

import React, { PropsWithChildren, useContext } from "react";

import { VideoContext } from "./VideoProvider";

function isNumeric(str: string) {
    return !isNaN(parseFloat(str));
}

export default function VideoUploadForm({ children }: PropsWithChildren) {
    const { form, file, updateFile, currentResult } = useContext(VideoContext);

    return (
        <form
            ref={form}
            action={async () => {
                if (!file) return;

                const controller = new AbortController();
                const signal = controller.signal;
                updateFile({
                    cancelUploadingResponse: () => controller.abort(),
                });

                const formData = new FormData();
                formData.append("file", file);
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
                        signal,
                    });

                    if (res.status !== 200 || !res.body) {
                        // TODO: done uploading: remove on success?
                        updateFile({
                            cancelUploadingResponse: null,
                            upload: 0,
                        });
                        return;
                    }

                    const reader = res.body
                        .pipeThrough(new TextDecoderStream())
                        .getReader();
                    updateFile({
                        cancelUploadingResponse: () => reader.cancel(),
                    });

                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        const parts = value.split(">");

                        if (parts.length < 2 || parts[0] !== file.name)
                            continue;

                        const command = parts[1];
                        if (
                            command === "progress" &&
                            parts.length > 2 &&
                            isNumeric(parts[2])
                        ) {
                            updateFile({ upload: parseFloat(parts[2]) });
                        } else if (command === "conflict") {
                            // TODO: conflict
                        } else if (command === "done") {
                            updateFile({ upload: 1 });
                        }
                    }

                    // TODO: done uploading: remove on success?
                    updateFile({ cancelUploadingResponse: null, upload: 0 });
                } catch (error) {
                    updateFile({ cancelUploadingResponse: null, upload: 0 });
                }
            }}
        >
            {children}
        </form>
    );
}
