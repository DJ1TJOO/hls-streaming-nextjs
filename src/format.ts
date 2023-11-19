export function formatTimeOverview(duration: number) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.max(Math.round((duration % 3600) / 60), 1);

    if (hours > 0) return `${hours}h${minutes}m`;
    return `${minutes}m`;
}

export function formatTimePlayer(currentTime: number, duration: number) {
    return `${formatTime(currentTime)} / ${formatTime(duration)}`;
}

function formatTime(duration: number) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.round(duration % 60);

    if (hours > 0)
        return `${hours.toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            maximumFractionDigits: 0,
        })}:${minutes.toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            maximumFractionDigits: 0,
        })}:${seconds.toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            maximumFractionDigits: 0,
        })}`;
    return `${minutes.toLocaleString(undefined, {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 0,
    })}:${seconds.toLocaleString(undefined, {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 0,
    })}`;
}

export function formatTimePlayerActual(dateCurrent: Date, dateEnd: Date) {
    return `${dateCurrent.toLocaleTimeString()} / ${dateEnd.toLocaleTimeString()}`;
}

export function formatEnumeration(items: string[]) {
    if (items.length <= 0) return "";
    if (items.length === 1) return items[0];
    return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function formatYear(date: string | Date) {
    return new Date(date).toLocaleString(undefined, {
        year: "numeric",
    });
}

const noSpaceRegex = /[_\s]/gm;
export function formatName(name: string) {
    return name.toLowerCase().replace(noSpaceRegex, "-").trim();
}
