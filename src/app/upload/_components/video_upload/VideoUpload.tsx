"use client";

import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { search } from "@/tmdb/search";

import { FileUploadFile, FilesContext } from "../FilesProvider";
import VideoDescription from "./VideoDescription";
import { VideoContext } from "./VideoProvider";
import VideoUploadControls from "./VideoUploadControls";
import VideoUploadForm from "./VideoUploadForm";
import VideoUploadPreview from "./VideoUploadPreview";
import VideoUploadProgressBar from "./VideoUploadProgressBar";

export default function VideoUpload({ file }: { file: FileUploadFile }) {
    const container = useRef<HTMLDivElement | null>(null);

    const { setFiles } = useContext(FilesContext);

    const [searchResults, setSearchResults] =
        useState<Awaited<ReturnType<typeof search>>>(null);
    const [currentResult, setCurrentResult] = useState<
        NonNullable<Awaited<ReturnType<typeof search>>>["best"] | null
    >(null);

    useEffect(() => {
        search(file.name).then((x) => {
            setSearchResults(x);
            if (x) {
                setCurrentResult((prev) => prev ?? x.best);
            }
        });
    }, [file.name]);

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
                if (index < 0) return [...prev];

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
        [file, setFiles]
    );

    return (
        <VideoContext.Provider
            value={{
                file,
                updateFile,
                currentResult,
                setCurrentResult,
                searchResults,
                setSearchResults,
                form,
            }}
        >
            <VideoUploadForm>
                <section className="flex w-full flex-col gap-3">
                    <div className="flex w-full gap-3">
                        <VideoUploadPreview />
                        <div
                            ref={container}
                            className="flex w-full flex-col gap-3"
                        >
                            <VideoUploadControls container={container} />
                            <VideoDescription />
                        </div>
                    </div>
                    <VideoUploadProgressBar />
                </section>
            </VideoUploadForm>
        </VideoContext.Provider>
    );
}
