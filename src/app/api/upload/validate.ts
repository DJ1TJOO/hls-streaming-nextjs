import { SearchResult } from "@/tmdb/search";

type RequiredNotNull<T> = Required<{
    [P in keyof T]: NonNullable<T[P]>;
}>;
type Ensure<T, K extends keyof T> = Omit<T, K> & RequiredNotNull<Pick<T, K>>;
type EnsureNonNullable<T, K extends keyof NonNullable<T>> = Ensure<
    NonNullable<T>,
    K
>;

export type ValidForm =
    | {
          tmdb_id: number;
          tmdb_season_nr: null;
          tmdb_episode_nr: null;
      }
    | {
          tmdb_id: number;
          tmdb_season_nr: number;
          tmdb_episode_nr: number;
      };

export type ValidatedSearchResult =
    | {
          movie: EnsureNonNullable<
              SearchResult["movie"],
              | "id"
              | "title"
              | "runtime"
              | "poster_path"
              | "backdrop_path"
              | "release_date"
          >;
          tv: null;
          episode: null;
      }
    | {
          movie: null;
          tv: EnsureNonNullable<
              SearchResult["tv"],
              | "id"
              | "name"
              | "number_of_seasons"
              | "number_of_episodes"
              | "poster_path"
              | "backdrop_path"
              | "first_air_date"
          > & {
              [key: `season/${number}`]: EnsureNonNullable<
                  NonNullable<SearchResult["tv"]>[`season/${number}`],
                  | "name"
                  | "poster_path"
                  | "episodes"
                  | "season_number"
                  | "air_date"
              >;
          };
          episode: EnsureNonNullable<
              SearchResult["episode"],
              | "name"
              | "season_number"
              | "episode_number"
              | "runtime"
              | "air_date"
          >;
      };

export function validateForm(tmdb?: {
    tmdb_id?: number;
    tmdb_season_nr?: number;
    tmdb_episode_nr?: number;
}) {
    if (typeof tmdb !== "object") return false;

    // No id, or missing season or episode
    if (
        !Object.hasOwn(tmdb, "tmdb_id") ||
        (Object.hasOwn(tmdb, "tmdb_season_nr") &&
            !Object.hasOwn(tmdb, "tmdb_episode_nr")) ||
        (!Object.hasOwn(tmdb, "tmdb_season_nr") &&
            Object.hasOwn(tmdb, "tmdb_episode_nr"))
    ) {
        return false;
    }

    if (
        tmdb.tmdb_id === null ||
        (tmdb.tmdb_season_nr !== null && tmdb.tmdb_episode_nr === null) ||
        (tmdb.tmdb_season_nr === null && tmdb.tmdb_episode_nr !== null)
    ) {
        return false;
    }

    return true;
}

export function validateSearchResult(tmdb: SearchResult) {
    // Validate json data
    if (typeof tmdb !== "object") return false;

    // Either a movie or tv and episode must be specified
    if (
        !Object.hasOwn(tmdb, "movie") &&
        (!Object.hasOwn(tmdb, "tv") || !Object.hasOwn(tmdb, "episode"))
    ) {
        return false;
    }

    if (tmdb.movie === null && (tmdb.tv === null || tmdb.episode === null)) {
        return false;
    }

    if (tmdb.movie) {
        // Validate movie
        if (
            typeof tmdb.movie.id === "undefined" ||
            typeof tmdb.movie.title === "undefined" ||
            typeof tmdb.movie.runtime === "undefined" ||
            typeof tmdb.movie.poster_path === "undefined" ||
            typeof tmdb.movie.backdrop_path === "undefined" ||
            typeof tmdb.movie.release_date === "undefined" ||
            (tmdb.movie.belongs_to_collection &&
                typeof tmdb.movie.belongs_to_collection.id === "undefined")
        ) {
            return false;
        }
    } else {
        // Validate serie
        if (
            typeof tmdb.tv.id === "undefined" ||
            typeof tmdb.tv.name === "undefined" ||
            typeof tmdb.tv.number_of_seasons === "undefined" ||
            typeof tmdb.tv.number_of_episodes === "undefined" ||
            typeof tmdb.tv.poster_path === "undefined" ||
            tmdb.tv.poster_path === null ||
            typeof tmdb.tv.backdrop_path === "undefined" ||
            tmdb.tv.backdrop_path === null ||
            typeof tmdb.tv.first_air_date === "undefined"
        ) {
            return false;
        }

        // Validate episode
        if (
            typeof tmdb.episode.season_number === "undefined" ||
            typeof tmdb.episode.episode_number === "undefined" ||
            typeof tmdb.episode.name === "undefined" ||
            typeof tmdb.episode.runtime === "undefined" ||
            typeof tmdb.episode.air_date === "undefined"
        ) {
            return false;
        }

        // Validate season
        const season = tmdb.tv[`season/${tmdb.episode.season_number}`];
        if (
            typeof season === "undefined" ||
            typeof season.name === "undefined" ||
            typeof season.season_number === "undefined" ||
            typeof season.air_date === "undefined" ||
            typeof season.poster_path === "undefined" ||
            season.poster_path === null ||
            typeof season.episodes === "undefined"
        ) {
            return false;
        }
    }

    return true;
}
