"use client";

import React, { PropsWithChildren, createContext, useState } from "react";

export type FileUploadFile = File & {
    preview: string;
    duration: number;
    upload: number;
    uploadingResponse: ReadableStreamDefaultReader<string> | null;
};

export const FilesContext = createContext<{
    files: FileUploadFile[];
    setFiles: React.Dispatch<React.SetStateAction<FileUploadFile[]>>;
}>({
    files: [],
    setFiles: () => {},
});

export default function FilesProvider({ children }: PropsWithChildren) {
    const [files, setFiles] = useState<FileUploadFile[]>([]);

    return (
        <FilesContext.Provider value={{ files, setFiles }}>
            {children}
        </FilesContext.Provider>
    );
}
