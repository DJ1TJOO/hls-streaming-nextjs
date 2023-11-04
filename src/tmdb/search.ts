import {
    Episode,
    MovieDb,
    MovieResult,
    PersonResult,
    SearchMultiResponse,
    TvResult,
} from "moviedb-promise";

import {
    extractName,
    extractSeasonEpisode,
    extractYear,
    prepareFileName,
} from "./extractor";

const db = new MovieDb(process.env.NEXT_PUBLIC_TMDB_API_KEY!);

type SearchResult =
    | {
          result: MovieResult;
          episode: null;
          seasonEpisode: null;
      }
    | {
          result: TvResult;
          episode: (Episode & { runtime?: number }) | null;
          seasonEpisode: {
              season: number | null;
              episode: number | null;
          } | null;
      };

export async function search(fileName: string) {
    const preparedFileName = prepareFileName(fileName);
    const name = extractName(preparedFileName);
    const seasonEpisode = extractSeasonEpisode(preparedFileName);
    const year = extractYear(preparedFileName);
    console.log(year, preparedFileName);

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

    const results =
        (searchResult.results?.filter((x) => x.media_type !== "person") as (
            | MovieResult
            | TvResult
        )[]) ?? [];
    if (results.length < 1) return null;

    const mappedResults = await Promise.all(
        results.map(async (x) => {
            if (x.media_type === "movie") {
                return {
                    result: x,
                    episode: null,
                    seasonEpisode: null,
                };
            }

            const foundSeasonEpisode = await findSeasonEpisode(
                seasonEpisode,
                x
            );

            let episode = null;
            if (
                foundSeasonEpisode?.season &&
                foundSeasonEpisode.episode &&
                x.id
            ) {
                episode = await db.episodeInfo({
                    id: x.id,
                    season_number: foundSeasonEpisode.season,
                    episode_number: foundSeasonEpisode.episode,
                });
            }

            return {
                result: x,
                episode,
                seasonEpisode: foundSeasonEpisode,
            };
        })
    );
    const best = findBestResult(mappedResults, year);

    return {
        best,
        info: { name, seasonEpisode, year },
        results: mappedResults,
    };
}

function findBestResult(results: SearchResult[], year: string | null) {
    let bestResult = results[0];

    if (year) {
        const findBest = results.find(
            (x) =>
                (x.result.media_type === "tv" &&
                    x.result.first_air_date?.includes(year)) ||
                (x.result.media_type === "movie" &&
                    x.result.release_date?.includes(year))
        );
        if (findBest) bestResult = findBest;
    }

    return bestResult;
}

async function findSeasonEpisode(
    seasonEpisode: {
        season: number | null;
        episode: number | null;
    } | null,
    result: TvResult | MovieResult
) {
    if (result.media_type !== "tv") {
        return null;
    }

    let bestSeasonEpisode: {
        season: number | null;
        episode: number | null;
    } = { season: null, episode: null };

    if (!result.id) return bestSeasonEpisode;

    const tvResult = await db.tvInfo(result.id);

    if (
        seasonEpisode?.season &&
        tvResult.number_of_seasons &&
        seasonEpisode.season <= tvResult.number_of_seasons
    ) {
        bestSeasonEpisode.season = seasonEpisode.season;
    }
    if (
        seasonEpisode?.episode &&
        tvResult.number_of_episodes &&
        seasonEpisode.episode <= tvResult.number_of_episodes
    ) {
        bestSeasonEpisode.episode = seasonEpisode.episode;
    }

    return bestSeasonEpisode;
}
