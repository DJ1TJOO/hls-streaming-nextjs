"use client";

import React, { createContext } from "react";

import { search } from "@/tmdb/search";

import { FileUploadFile } from "../FilesProvider";

export type VideoType = {
    file: FileUploadFile | null;
    searchResults: Awaited<ReturnType<typeof search>>;
    currentResult:
        | NonNullable<Awaited<ReturnType<typeof search>>>["best"]
        | null;
};

export const VideoContext = createContext<{
    file: VideoType["file"];
    removeFile: () => void;
    searchResults: VideoType["searchResults"] | null;
    setSearchResults: React.Dispatch<
        React.SetStateAction<VideoType["searchResults"]>
    >;
    currentResult: VideoType["currentResult"] | null;
    setCurrentResult: React.Dispatch<
        React.SetStateAction<VideoType["currentResult"]>
    >;
    currentProgress: number;
    setCurrentProgress: React.Dispatch<React.SetStateAction<number>>;
    currentError: string | null;
    setCurrentError: React.Dispatch<React.SetStateAction<string | null>>;
    cancelUpload: AbortController | ReadableStreamDefaultReader<string> | null;
    setCancelUpload: React.Dispatch<
        React.SetStateAction<
            AbortController | ReadableStreamDefaultReader<string> | null
        >
    >;
    form: React.MutableRefObject<HTMLFormElement | null>;
}>({
    file: null,
    removeFile: () => {},
    currentResult: null,
    setCurrentResult: () => {},
    searchResults: null,
    setSearchResults: () => {},
    currentProgress: 0,
    setCurrentProgress: () => {},
    currentError: null,
    setCurrentError: () => {},
    cancelUpload: null,
    setCancelUpload: () => {},
    form: { current: null },
});
