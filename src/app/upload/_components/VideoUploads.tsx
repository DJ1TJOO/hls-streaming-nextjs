"use client";

import React, { useContext } from "react";

import { FilesContext } from "./FilesProvider";
import VideoUpload from "./video_upload/VideoUpload";

export default function VideoUploads() {
    const { files } = useContext(FilesContext);

    return files.map((file) => (
        <VideoUpload key={file.name + file.lastModified} file={file} />
    ));
}
