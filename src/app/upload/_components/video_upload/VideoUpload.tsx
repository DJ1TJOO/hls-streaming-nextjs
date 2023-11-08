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

    const { setFiles, files } = useContext(FilesContext);

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
                cancelUploadingResponse?: (() => void | Promise<void>) | null;
            } | null
        ) => {
            const index = files.findIndex((x) => x.name === file.name);
            if (index < 0) return;

            if (updated !== null) {
                const file = files[index];
                if (typeof updated.upload !== "undefined") {
                    file.upload = updated.upload;
                }
                if (typeof updated.cancelUploadingResponse !== "undefined") {
                    file.cancelUploadingResponse =
                        updated.cancelUploadingResponse;
                }
                files[index] = file;
            } else {
                files.splice(index, 1);
            }

            setFiles([...files]);
        },
        [file, files, setFiles]
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
