import path from "path";

export type SeasonEpisode = {
    season: number | null;
    episode: number | null;
} | null;

const yearRegex = /\(?(?:19|(?:[2-9]\d))\d{2}\)?/m;
const seasonEpisodeRegex =
    /(?:ix)?(?:(?:s|season|^)?\s*(\d{1,}))?\s??(?:e|x|episode)\s*(\d{1,})/gim;

export function prepareFileName(fileName: string) {
    return path
        .parse(fileName)
        .name.replace(/[_.\-+]/gm, " ")
        .trim();
}

export function extractName(fileName: string): string {
    return fileName
        .split(yearRegex)
        .flatMap((x) => x.split(seasonEpisodeRegex))[0]
        .trim();
}

export function extractYear(fileName: string) {
    return yearRegex.exec(fileName)?.[0] ?? null;
}

export function extractSeasonEpisode(fileName: string): SeasonEpisode {
    let bestMatch = null;
    let match: RegExpExecArray | null;
    while ((match = seasonEpisodeRegex.exec(fileName)) !== null) {
        const mapped = mapRegex(match);
        if (!bestMatch) {
            bestMatch = mapped;
            continue;
        }

        if (mapped.season && !bestMatch.season) {
            bestMatch = mapped;
            continue;
        }

        if (mapped.episode && !bestMatch.episode) bestMatch = mapped;
    }

    return bestMatch;
}

function mapRegex(match: RegExpExecArray) {
    return {
        season: match[1] ? parseInt(match[1]) : null,
        episode: match[2] ? parseInt(match[2]) : null,
    };
}
