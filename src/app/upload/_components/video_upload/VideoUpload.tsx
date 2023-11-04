"use client";

import React, { useCallback, useContext, useRef } from "react";

import { FileUploadFile, FilesContext } from "../FilesProvider";
import VideoUploadControls from "./VideoUploadControls";
import VideoUploadForm from "./VideoUploadForm";
import VideoUploadPreview from "./VideoUploadPreview";
import VideoUploadProgressBar from "./VideoUploadProgressBar";

export default function VideoUpload({ file }: { file: FileUploadFile }) {
    const { setFiles } = useContext(FilesContext);

    const form = useRef<HTMLFormElement | null>(null);
    const updateFile = useCallback(
        (
            updated: {
                upload?: number;
                uploadingResponse?: ReadableStreamDefaultReader<string> | null;
            } | null
        ) =>
            setFiles((prev) => {
                const index = prev.findIndex((x) => x.name === file.name);

                if (updated !== null) {
                    const file = prev[index];
                    if (typeof updated.upload !== "undefined") {
                        file.upload = updated.upload;
                    }
                    if (typeof updated.uploadingResponse !== "undefined") {
                        file.uploadingResponse = updated.uploadingResponse;
                    }
                } else {
                    prev.splice(index, 1);
                }

                return [...prev];
            }),
        [file]
    );

    return (
        <VideoUploadForm file={file} form={form} updateFile={updateFile}>
            <section className="flex w-full flex-col gap-3">
                <div className="flex w-full gap-3">
                    <VideoUploadPreview file={file} />
                    <div className="flex flex-col gap-3">
                        <VideoUploadControls
                            file={file}
                            form={form}
                            updateFile={updateFile}
                        />
                        <div className="flex gap-3">
                            <div className="flex w-full flex-col gap-1">
                                <h1 className="text-xl font-medium text-text">
                                    Meg 2: The Trench{" "}
                                    <span className="text-text-dark">
                                        (2023)
                                    </span>
                                </h1>
                                <p className="text-sm text-text-dark">
                                    An exploratory dive into the deepest depths
                                    of the ocean of a daring research team
                                    spirals into chaos when a malevolent mining
                                    operation threatens their mission and forces
                                    them into a high-stakes battle for survival.
                                </p>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <h1 className="text-xl font-medium text-text">
                                    Pilot{" "}
                                    <span className="text-text-dark">
                                        • 1h21m
                                    </span>
                                </h1>
                                <p className="text-sm text-text-dark">
                                    A "closer" for one of New York City's most
                                    successful law firms decides to hire an
                                    aloof genius who has passed the bar but
                                    never went to law school as his associate.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <VideoUploadProgressBar file={file} />
            </section>
        </VideoUploadForm>
    );
}
