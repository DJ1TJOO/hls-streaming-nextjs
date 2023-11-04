import React from "react";

import { formatEnumeration } from "@/format";
import { FileRejection } from "react-dropzone";

export default function VideoUploadRejections({
    fileRejections,
}: {
    fileRejections: FileRejection[];
}) {
    if (fileRejections.length < 1) return null;

    const fileNames = fileRejections.map((x) => x.file.name);
    const fileErrors = fileRejections
        .flatMap((x) => x.errors.map((x) => x.message))
        .filter((value, index, array) => array.indexOf(value) === index);

    return (
        <p className="flex flex-col items-center gap-1 text-xs text-text-dark">
            The following files where not accepted:{" "}
            {formatEnumeration(fileNames)}
            <br />
            For the following reasons: {formatEnumeration(fileErrors)}
        </p>
    );
}
