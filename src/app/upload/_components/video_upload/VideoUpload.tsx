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
    const [currentProgress, setCurrentProgress] = useState(0);
    const [currentError, setCurrentError] = useState<string | null>(null);
    const [cancelUpload, setCancelUpload] = useState<
        AbortController | ReadableStreamDefaultReader<string> | null
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

    return (
        <VideoContext.Provider
            value={{
                file,
                removeFile: () => {
                    setFiles((prev) => {
                        const current = [...prev];
                        const index = current.findIndex(
                            (x) => x.name === file.name
                        );
                        if (index < 0) return current;

                        current.splice(index, 1);
                        return current;
                    });
                },
                currentResult,
                setCurrentResult,
                searchResults,
                setSearchResults,
                currentProgress,
                setCurrentProgress,
                currentError,
                setCurrentError,
                cancelUpload,
                setCancelUpload,
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
                            {currentError && (
                                <div className="flex w-fit gap-2 rounded-xl bg-error px-3 py-2 text-sm text-text">
                                    {currentError}
                                </div>
                            )}
                            <VideoDescription />
                        </div>
                    </div>
                    <VideoUploadProgressBar />
                </section>
            </VideoUploadForm>
        </VideoContext.Provider>
    );
}
