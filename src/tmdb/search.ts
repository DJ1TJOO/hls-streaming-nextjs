import {
    Episode,
    MovieDb,
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

const db = new MovieDb(process.env.NEXT_PUBLIC_TMDB_API_KEY!);

export type SearchResult =
    | {
          movieSeries: MovieResult;
          episode: null;
      }
    | {
          movieSeries: TvResult;
          episode: Episode & { runtime?: number };
      };

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
    if (result.media_type === "movie") {
        return {
            movieSeries: result,
            episode: null,
        };
    }

    // No valid id so cannot search for episodes
    if (!result.id) {
        return [];
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
    })) as ShowResponse & { [key: `season/${number}`]: TvSeasonResponse };

    if (!tv.seasons) return [];
    const tvSeasons = tv.seasons.flatMap((season) =>
        typeof season.season_number !== "undefined"
            ? tv[`season/${season.season_number}`]
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
            movieSeries: result,
            episode,
        };
    }

    // No episode speficified, return first of season
    if (seasonEpisode.season !== null && seasonEpisode.episode === null) {
        const episode = resolveEpisode(tvSeasons, seasonEpisode.season, 1);
        if (!episode) return [];

        return {
            movieSeries: result,
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
        movieSeries: result,
        episode: episode,
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

    const bestResult = results.find((x) =>
        x.movieSeries.media_type === "tv"
            ? x.movieSeries.first_air_date?.includes(year)
            : x.movieSeries.release_date?.includes(year)
    );
    return bestResult ?? results[0];
}
