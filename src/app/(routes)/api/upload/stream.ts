export async function createStream(abort: () => void) {
    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    const response = new Response(responseStream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache, no-transform",
            "Content-Encoding": "none",
        },
    });

    let closed = false;
    const write = async (message: string) => {
        if (closed) return;
        await writer.write(encoder.encode(message));
    };
    const close = async () => {
        closed = true;
        await writer.close();
    };
    writer.closed.then(() => {
        if (!closed) abort();
        closed = true;
    });

    return { response, write, close };
}

export async function mapAsync<T>(array: T[], mapper: (x: T) => Promise<void>) {
    return await Promise.all(array.map(mapper));
}

export function createConflictMessage(fileName: string) {
    return `${fileName}>conflict`;
}

export function createProgressMessage(fileName: string, progress: number) {
    return `${fileName}>progress>${progress.toFixed(4)}`;
}

export function createDoneMessage(fileName: string) {
    return `${fileName}>done`;
}

export function createCancelledMessage(fileName: string) {
    return `${fileName}>cancelled`;
}

export function createUploadMessage(fileName: string, token: string) {
    return `${fileName}>upload>${token}`;
}
