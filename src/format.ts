export function formatTime(duration: number) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.max(Math.round((duration % 3600) / 60), 1);

    if (hours > 0) return `${hours}h${minutes}m`;
    return `${minutes}m`;
}

export function formatEnumeration(items: string[]) {
    if (items.length <= 0) return "";
    if (items.length === 1) return items[0];
    return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
