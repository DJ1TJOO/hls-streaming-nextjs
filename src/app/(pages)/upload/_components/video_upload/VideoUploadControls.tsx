"use client";

import React, { useContext } from "react";

import {
    DocumentArrowUpIcon,
    DocumentMinusIcon,
} from "@heroicons/react/24/outline";

import { VideoContext } from "./VideoProvider";
import VideoUploadSearch from "./VideoUploadSearch";

export default function VideoUploadControls({
    container,
}: {
    container: React.MutableRefObject<HTMLDivElement | null>;
}) {
    const {
        file,
        form,
        currentResult,
        removeFile,
        currentProgress,
        setCurrentProgress,
        cancelUpload,
        setCurrentError,
        setCancelUpload,
    } = useContext(VideoContext);

    if (!file) return null;

    return (
        <div className="flex w-full justify-between">
            <div className="flex gap-3">
                <VideoUploadSearch container={container} />
            </div>
            <div className="flex gap-2">
                {currentResult !== null &&
                    (currentProgress <= 0 ? (
                        <button
                            type="button"
                            className="flex gap-2 rounded-xl bg-action py-2 pl-3 pr-4 text-sm text-text"
                            onClick={() => {
                                if (!form.current) return;

                                setCurrentProgress(0.001);
                                setCurrentError(null);

                                form.current.requestSubmit();
                            }}
                        >
                            <DocumentArrowUpIcon className="h-5 w-5" />
                            Upload
                        </button>
                    ) : (
                        <div className="flex gap-2 rounded-xl bg-tertiary py-2 pl-3 pr-4 text-sm text-text">
                            <DocumentArrowUpIcon className="h-5 w-5" />
                            {currentProgress < 1 ? "Uploading" : "Uploaded"}
                        </div>
                    ))}
                {currentProgress < 1 && (
                    <button
                        type="button"
                        onClick={async () => {
                            if (currentProgress > 0) {
                                if (cancelUpload instanceof AbortController) {
                                    await cancelUpload.abort();
                                } else if (
                                    cancelUpload instanceof
                                    ReadableStreamDefaultReader
                                ) {
                                    await cancelUpload.cancel();
                                }

                                setCurrentProgress(0);
                                return;
                            }

                            URL.revokeObjectURL(file.preview);
                            removeFile();
                        }}
                        className="flex gap-2 rounded-xl bg-secondairy py-2 pl-3 pr-4 text-sm text-text"
                    >
                        <DocumentMinusIcon className="h-5 w-5" />
                        {currentProgress > 0 ? "Cancel" : "Remove"}
                    </button>
                )}
            </div>
        </div>
    );
}
