import { existsSync } from "fs";
import { readFile, rm } from "fs/promises";

function timeout(maxDuration: number) {
    return new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(false), maxDuration)
    );
}

export async function isFileUploaded(
    uploadFilePath: string,
    maxDuration: number
) {
    let raceCompleted = false;
    const uploaded = await Promise.race([
        new Promise<boolean>(async (res) => {
            let uploaded = false;
            while (!raceCompleted && !uploaded) {
                uploaded = await checkFileUpload(uploadFilePath);
                await timeout(1000);
            }

            if (uploaded) {
                await rm(uploadFilePath);
            }

            res(uploaded);
        }),
        timeout(maxDuration),
    ]);
    raceCompleted = true;

    return uploaded;
}

async function checkFileUpload(uploadFilePath: string) {
    try {
        if (!existsSync(uploadFilePath)) return false;
        if ((await readFile(uploadFilePath, "utf-8")) !== "1") return false;

        return true;
    } catch {
        return false;
    }
}
