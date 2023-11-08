"use server";

import {
    Episode,
    MovieDb,
    MovieResponse,
    MovieResult,
    SearchMultiResponse,
    ShowResponse,
    TvResult,
    TvSeasonResponse,
} from "moviedb-promise";

import {
    SeasonEpisode,
    extractName,
    extractSeasonEpisode,
    extractYear,
    prepareFileName,
} from "./extractor";

const db = new MovieDb(process.env.TMDB_API_KEY!);

export type ShowResponseWithSeasons = ShowResponse & {
    [key: `season/${number}`]: TvSeasonResponse | undefined;
};

export type ShowResponseWithSeasonAndEpisode = ShowResponse & {
    [key: `season/${number}`]: TvSeasonResponse | undefined;
    [key: `season/${number}/episode/${number}`]: Episode | undefined;
};

export type MovieWithCollection = MovieResponse & {
    belongs_to_collection?: {
        id: number;
        name: string;
        poster_path?: string;
        backdrop_path?: string;
    };
};
export type SearchResult =
    | {
          movie: MovieWithCollection;
          tv: null;
          episode: null;
      }
    | {
          movie: null;
          tv: ShowResponseWithSeasons;
          episode: Episode & { runtime?: number };
      };

export async function searchWihId(
    tmdb_id: number,
    tmdb_season_nr?: number | null,
    tmdb_episode_nr?: number | null
) {
    if (
        (typeof tmdb_season_nr !== "undefined" &&
            typeof tmdb_episode_nr === "undefined") ||
        (typeof tmdb_season_nr === "undefined" &&
            typeof tmdb_episode_nr !== "undefined") ||
        (tmdb_season_nr !== null && tmdb_episode_nr === null) ||
        (tmdb_season_nr === null && tmdb_episode_nr !== null)
    ) {
        return null;
    }

    const isEpisode =
        typeof tmdb_season_nr !== "undefined" &&
        typeof tmdb_episode_nr !== "undefined" &&
        tmdb_season_nr !== null &&
        tmdb_episode_nr !== null;
    if (isEpisode) {
        const serie = (await db.tvInfo({
            id: tmdb_id,
            append_to_response: `season/${tmdb_season_nr},season/${tmdb_season_nr}/episode/${tmdb_episode_nr}`,
        })) as ShowResponseWithSeasonAndEpisode;

        const episode =
            serie[`season/${tmdb_season_nr}/episode/${tmdb_episode_nr}`];
        if (
            typeof serie[`season/${tmdb_season_nr}`] === "undefined" ||
            typeof episode === "undefined"
        )
            return null;

        return {
            movie: null,
            tv: serie,
            episode,
        };
    }

    const movie = (await db.movieInfo(tmdb_id)) as MovieWithCollection;
    return {
        movie,
        tv: null,
        episode: null,
    };
}

export async function search(fileName: string) {
    const preparedFileName = prepareFileName(fileName);
    const name = extractName(preparedFileName);

    const searchResult = await db
        .searchMulti({
            query: name,
        })
        .catch(
            () =>
                ({
                    results: [],
                }) as SearchMultiResponse
        );

    return await resolveSearch(searchResult, preparedFileName);
}

async function resolveSearch(
    searchResult: SearchMultiResponse,
    preparedFileName: string
) {
    if (!searchResult.results || searchResult.results.length < 1) return null;

    // Remove persons as we don't care about those
    const resultsWithoutPersons = searchResult.results.filter(
        (x) => x.media_type !== "person"
    ) as (MovieResult | TvResult)[];
    if (resultsWithoutPersons.length < 1) return null;

    // Find episodes
    const resultsWithEpisodes = await resolveEpisodes(
        resultsWithoutPersons,
        preparedFileName
    );
    const best = findBestResult(resultsWithEpisodes, preparedFileName);

    return {
        best,
        results: resultsWithEpisodes,
    } as {
        best: SearchResult;
        results: SearchResult[];
    };
}

async function resolveEpisodes(
    resultsWithoutPersons: (MovieResult | TvResult)[],
    preparedFileName: string
) {
    const seasonEpisode = extractSeasonEpisode(preparedFileName);
    const episodesPromises = resultsWithoutPersons.map(
        resolveEpisodesMap.bind(undefined, seasonEpisode)
    );

    const resultsWithEpisodes = await Promise.all(episodesPromises);
    return resultsWithEpisodes.flat();
}

async function resolveEpisodesMap(
    seasonEpisode: SeasonEpisode,
    result: MovieResult | TvResult
) {
    // No valid id so cannot search for movie, episodes
    if (!result.id) {
        return [];
    }

    if (result.media_type === "movie") {
        const movie = (await db.movieInfo({
            id: result.id,
        })) as MovieWithCollection;

        return {
            movie,
            tv: null,
            episode: null,
        };
    }

    // Get seaons and info
    // Prefetch
    const preTv = await db.tvInfo({
        id: result.id,
    });
    // With seasons
    const tv = (await db.tvInfo({
        id: result.id,
        append_to_response: preTv.seasons
            ?.map((x) => `season/${x.season_number}`)
            .join(","),
    })) as ShowResponseWithSeasons;

    if (!tv.seasons) return [];
    const tvSeasons = tv.seasons.flatMap((season) =>
        typeof season.season_number !== "undefined" &&
        typeof tv[`season/${season.season_number}`] !== "undefined"
            ? tv[`season/${season.season_number}`]!
            : []
    );

    // No season or episode specified, return first episode or get specific episode
    if (
        !seasonEpisode ||
        (seasonEpisode.season === null && seasonEpisode.episode === null) ||
        (seasonEpisode.season !== null && seasonEpisode.episode !== null)
    ) {
        let seasonNumber = seasonEpisode?.season ?? 1;
        let episodeNumber = seasonEpisode?.episode ?? 1;

        // Return episode
        const episode = resolveEpisode(tvSeasons, seasonNumber, episodeNumber);
        if (!episode) return [];

        return {
            movie: null,
            tv,
            episode,
        };
    }

    // No episode speficified, return first of season
    if (seasonEpisode.season !== null && seasonEpisode.episode === null) {
        const episode = resolveEpisode(tvSeasons, seasonEpisode.season, 1);
        if (!episode) return [];

        return {
            movie: null,
            tv,
            episode,
        };
    }

    // No season speficied, return for all seasons
    const episodeNumber = seasonEpisode.episode;
    if (episodeNumber === null) {
        return [];
    }

    // Find all best episodes for each season
    const resolvedEpisodes = tvSeasons.map((season) =>
        season.season_number
            ? resolveEpisode(tvSeasons, season.season_number, episodeNumber)
            : null
    );
    // Remove null and duplicates
    const resolvedEpisodesFiltered = resolvedEpisodes.filter(
        (x, i) => x !== null && resolvedEpisodes.indexOf(x) === i
    ) as Episode[];

    return resolvedEpisodesFiltered.map((episode) => ({
        movie: null,
        tv,
        episode,
    }));
}

function resolveEpisode(
    tvSeasons: TvSeasonResponse[],
    seasonNumber: number,
    episodeNumber: number
) {
    let season: TvSeasonResponse | null = null;

    // If season doesn't exist replace with closest
    if (!tvSeasons.some((x) => x.season_number === seasonNumber)) {
        season = tvSeasons.reduce((prev, curr) =>
            // Find closest to intended season
            Math.abs((curr.season_number ?? -1) - seasonNumber) <
            Math.abs((prev.season_number ?? -1) - seasonNumber)
                ? curr
                : prev
        );
    } else {
        season =
            tvSeasons.find((x) => x.season_number === seasonNumber) ?? null;
    }

    // No season found
    if (!season) {
        return null;
    }

    let episode: Episode | null = null;

    // If season doesn't exist replace with closest
    if (!season.episodes?.some((x) => x.episode_number === episodeNumber)) {
        episode =
            season.episodes?.reduce((prev, curr) =>
                // Find closest to intended season
                Math.abs((curr.episode_number ?? -1) - episodeNumber) <
                Math.abs((prev.episode_number ?? -1) - episodeNumber)
                    ? curr
                    : prev
            ) ?? null;
    } else {
        episode =
            season.episodes.find((x) => x.episode_number === episodeNumber) ??
            null;
    }

    // No episode found
    if (!episode) {
        return null;
    }

    // Attributes missing
    if (
        !episode.id ||
        typeof episode.season_number === "undefined" ||
        typeof episode.episode_number === "undefined"
    ) {
        return null;
    }

    return episode;
}

function findBestResult(results: SearchResult[], preparedFileName: string) {
    const year = extractYear(preparedFileName);
    if (!year) return results[0];

    const bestResult = results.find(
        (x) =>
            x.movie?.release_date?.includes(year) ||
            x.tv?.first_air_date?.includes(year)
    );
    return bestResult ?? results[0];
}
