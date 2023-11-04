import path from "path";

export function forcePosixPath(filePath: string) {
    return filePath.split(path.sep).join(path.posix.sep);
}
