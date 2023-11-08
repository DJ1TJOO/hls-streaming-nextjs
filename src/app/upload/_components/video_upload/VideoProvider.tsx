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
    updateFile: (
        updated: {
            upload?: number;
            cancelUploadingResponse?: (() => void | Promise<void>) | null;
        } | null
    ) => void;
    searchResults: VideoType["searchResults"] | null;
    setSearchResults: React.Dispatch<
        React.SetStateAction<VideoType["searchResults"]>
    >;
    currentResult: VideoType["currentResult"] | null;
    setCurrentResult: React.Dispatch<
        React.SetStateAction<VideoType["currentResult"]>
    >;
    form: React.MutableRefObject<HTMLFormElement | null>;
}>({
    file: null,
    updateFile: () => {},
    currentResult: null,
    setCurrentResult: () => {},
    searchResults: null,
    setSearchResults: () => {},
    form: { current: null },
});
