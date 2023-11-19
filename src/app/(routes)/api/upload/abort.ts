import { NextRequest } from "next/server";

export async function createAbortHandler(req: NextRequest) {
    let aborted = false;
    let aborts: {
        fileName: string | null;
        abort: () => Promise<void>;
    }[] = [];

    async function unregisterAborts(fileName: string | null, abort?: boolean) {
        const unregisteredAborts = aborts.filter(
            (x) => x.fileName === fileName
        );

        aborts = aborts.filter((x) => x.fileName !== fileName);

        if (abort) {
            for (const { abort } of unregisteredAborts) {
                await abort();
            }
        }
    }

    async function registerAbort(
        fileName: string | null,
        abort: (typeof aborts)[number]["abort"]
    ) {
        if (aborted) {
            await abort();
            return false;
        }

        aborts.unshift({ fileName, abort });
        return true;
    }

    async function abort() {
        aborted = true;

        for (const { abort } of aborts) {
            await abort();
        }
    }

    req.signal.addEventListener("abort", abort);

    return { abort, registerAbort, unregisterAborts };
}
