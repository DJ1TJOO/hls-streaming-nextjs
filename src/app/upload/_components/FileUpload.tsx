"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";

import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
    DropEvent,
    FileError,
    FileRejection,
    useDropzone,
} from "react-dropzone";

import { FilesContext } from "./FilesProvider";
import VideoUploadRejections from "./video_upload/VideoUploadRejections";

async function getDuration(file: File) {
    const url = URL.createObjectURL(file);

    return new Promise<number>((resolve) => {
        const audio = document.createElement("audio");
        audio.muted = true;
        const source = document.createElement("source");
        source.src = url;
        audio.preload = "metadata";
        audio.appendChild(source);
        audio.onloadedmetadata = function () {
            resolve(audio.duration);
        };
    });
}

export default function FileUpload() {
    const { files, setFiles } = useContext(FilesContext);
    const [animationPlayed, setAnimationPlayed] = useState(false);

    const onDrop = useCallback<
        <T extends File>(
            acceptedFiles: T[],
            fileRejections: FileRejection[],
            event: DropEvent
        ) => void
    >(async (acceptedFiles, rejectedFiles) => {
        if (acceptedFiles?.length) {
            const acceptedFilesMapped = await Promise.all(
                acceptedFiles.map(async (file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                        duration: await getDuration(file),
                        upload: 0,
                        uploadingResponse: null,
                    })
                )
            );

            setFiles((previousFiles) => [
                ...previousFiles,
                ...acceptedFilesMapped,
            ]);
        }

        if (rejectedFiles?.length) {
            setAnimationPlayed(false);
        }
    }, []);

    const validator = useCallback<
        <T extends File>(file: T) => FileError | FileError[] | null
    >(
        (file) => {
            if (files.some((x) => x.name === file.name))
                return {
                    code: "file-duplicate",
                    message: "File already uploading or uploaded",
                };
            return null;
        },
        [files]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } =
        useDropzone({
            accept: {
                "video/*": [],
            },
            maxSize: 5368709120, //5gb
            onDrop,
            validator,
        });

    useEffect(() => {
        return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <>
            <div
                {...getRootProps({
                    className:
                        "relative flex shrink-0 h-52 w-full rounded-3xl border-[0.3rem] border-dashed border-secondairy p-2 cursor-pointer",
                })}
            >
                <input {...getInputProps({ name: "file" })} />
                <div
                    className={clsx(
                        "flex h-full w-full  flex-col items-center justify-center gap-1 rounded-[13px] bg-tertiary from-tertiary to-error text-text",
                        fileRejections.length > 0 &&
                            !animationPlayed &&
                            "animate-pulse-once"
                    )}
                    onAnimationEnd={() => setAnimationPlayed(true)}
                >
                    <div className="flex items-center justify-center gap-1">
                        <DocumentArrowUpIcon className="h-5 w-5" />
                        {isDragActive
                            ? "Drop the files here ..."
                            : "Drag & drop files here, or click to select files"}
                    </div>
                    <VideoUploadRejections fileRejections={fileRejections} />
                </div>
            </div>
        </>
    );
}
