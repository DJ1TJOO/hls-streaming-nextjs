import { lstat, readdir, rmdir } from "fs/promises";
import path from "path";

export async function removeEmptyDirectories(directory: string) {
    // lstat does not follow symlinks (in contrast to stat)
    const fileStats = await lstat(directory);
    if (!fileStats.isDirectory()) {
        return;
    }
    let fileNames = await readdir(directory);
    if (fileNames.length > 0) {
        const recursiveRemovalPromises = fileNames.map((fileName) =>
            removeEmptyDirectories(path.join(directory, fileName))
        );
        await Promise.all(recursiveRemovalPromises);

        // re-evaluate fileNames; after deleting subdirectory
        // we may have parent directory empty now
        fileNames = await readdir(directory);
    }

    if (fileNames.length === 0) {
        await rmdir(directory);
    }
}
