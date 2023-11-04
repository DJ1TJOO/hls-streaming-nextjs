"use client";

import React, { PropsWithChildren } from "react";

import { FileUploadFile } from "../FilesProvider";

function isNumeric(str: string) {
    return !isNaN(parseFloat(str));
}

export default function VideoUploadForm({
    children,
    file,
    form,
    updateFile,
}: PropsWithChildren<{
    file: FileUploadFile;
    form: React.MutableRefObject<HTMLFormElement | null>;
    updateFile: (
        updated: {
            upload?: number;
            uploadingResponse?: ReadableStreamDefaultReader<string> | null;
        } | null
    ) => void;
}>) {
    return (
        <form
            ref={form}
            action={async () => {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "post",
                    body: formData,
                });

                if (res.status !== 200 || !res.body) return;

                const reader = res.body
                    .pipeThrough(new TextDecoderStream())
                    .getReader();
                updateFile({ uploadingResponse: reader });

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const parts = value.split(">");
                    if (
                        parts.length < 2 ||
                        parts[0] !== file.name ||
                        !isNumeric(parts[1])
                    )
                        continue;

                    updateFile({ upload: parseFloat(parts[1]) });
                }

                updateFile({ uploadingResponse: null });
            }}
        >
            {children}
        </form>
    );
}
