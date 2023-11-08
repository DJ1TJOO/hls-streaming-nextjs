"use client";

import React, { useContext, useEffect } from "react";

import { FilesContext } from "./FilesProvider";
import VideoUpload from "./video_upload/VideoUpload";

export default function VideoUploads() {
    const { files } = useContext(FilesContext);

    useEffect(() => {
        function handleUnload(event: BeforeUnloadEvent) {
            if (files.length < 1) {
                return;
            }

            event.preventDefault();
            event.returnValue = true;
        }

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, [files]);

    return files.map((file) => (
        <VideoUpload key={file.name + file.lastModified} file={file} />
    ));
}
