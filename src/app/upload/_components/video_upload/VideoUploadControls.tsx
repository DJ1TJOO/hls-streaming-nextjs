"use client";

import React from "react";

import {
    DocumentArrowUpIcon,
    DocumentMinusIcon,
} from "@heroicons/react/24/outline";

import { FileUploadFile } from "../FilesProvider";

export default function VideoUploadControls({
    file,
    form,
    updateFile,
}: {
    file: FileUploadFile;
    form: React.MutableRefObject<HTMLFormElement | null>;
    updateFile: (
        updated: {
            upload?: number;
            uploadingResponse?: ReadableStreamDefaultReader<string> | null;
        } | null
    ) => void;
}) {
    return (
        <div className="flex justify-between">
            <div className="flex gap-3"></div>
            <div className="flex gap-2">
                {file.upload <= 0 ? (
                    <button
                        className="flex gap-2 rounded-xl bg-action py-2 pl-3 pr-4 text-sm text-text"
                        onClick={() => {
                            updateFile({ upload: 0.001 });
                            if (form.current) form.current.requestSubmit();
                        }}
                    >
                        <DocumentArrowUpIcon className="h-5 w-5" />
                        Upload
                    </button>
                ) : (
                    <div className="flex gap-2 rounded-xl bg-tertiary py-2 pl-3 pr-4 text-sm text-text">
                        <DocumentArrowUpIcon className="h-5 w-5" />
                        Uploading
                    </div>
                )}
                <button
                    onClick={async () => {
                        if (file.upload > 0 && file.uploadingResponse) {
                            await file.uploadingResponse.cancel();
                            updateFile({ upload: 0 });
                            return;
                        }

                        updateFile(null);
                    }}
                    className="flex gap-2 rounded-xl bg-secondairy py-2 pl-3 pr-4 text-sm text-text"
                >
                    <DocumentMinusIcon className="h-5 w-5" />
                    {file.upload > 0 && file.uploadingResponse
                        ? "Cancel"
                        : "Remove"}
                </button>
            </div>
        </div>
    );
}