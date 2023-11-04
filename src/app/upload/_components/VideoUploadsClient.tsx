"use client";

import React, { useContext } from "react";

import { FileUploadFile, FilesContext } from "./FilesProvider";

export default function VideoUploadsClient({
    children,
}: {
    children(files: FileUploadFile[]): React.ReactNode;
}) {
    const { files } = useContext(FilesContext);
    return children(files);
}
