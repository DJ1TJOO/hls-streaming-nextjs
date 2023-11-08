import prisma from "@/db";
import { MovieDb } from "moviedb-promise";

import inserted from "./inserted";
import { ValidatedSearchResult } from "./validate";

export default async function insert(
    tmdbApiKey: string,
    tmdb: ValidatedSearchResult
) {
    // No duplicates
    if (await inserted(tmdb)) return null;

    // Insert movie
    if (tmdb.movie) {
        return await insertMovie(tmdbApiKey, tmdb.movie);
    }

    // Else insert serie/episode
    return await insertEpisode(tmdb.tv, tmdb.episode);
}

async function insertEpisode(
    tv: NonNullable<ValidatedSearchResult["tv"]>,
    episode: NonNullable<ValidatedSearchResult["episode"]>
) {
    if (!(await insertSerie(tv))) {
        return null;
    }

    if (!(await insertSeason(tv, episode.season_number))) {
        return null;
    }

    try {
        return await prisma.video.create({
            data: {
                title: episode.name,
                tmdb_serie_id: tv.id,
                tmdb_season_nr: episode.season_number,
                tmdb_episode_nr: episode.episode_number,
                duration: episode.runtime,
                overview: episode.overview ?? "",
                poster_path: episode.still_path,
                release_date: new Date(episode.air_date).toISOString(),
                backdrop_path: null,
            },
        });
    } catch (error) {
        return null;
    }
}

async function insertSeason(
    tv: NonNullable<ValidatedSearchResult["tv"]>,
    seasonNumber: number
) {
    const seasonCount = await prisma.season.count({
        where: {
            tmdb_serie_id: tv.id,
            tmdb_season_nr: seasonNumber,
        },
    });

    if (seasonCount > 0) return true;

    try {
        const season = tv[`season/${seasonNumber}`];
        await prisma.season.create({
            data: {
                tmdb_serie_id: tv.id,
                tmdb_season_nr: season.season_number,
                title: season.name,
                overview: tv.overview ?? "",
                episode_count: season.episodes.length,
                poster_path: season.poster_path,
                release_date: new Date(season.air_date).toISOString(),
            },
        });
        return true;
    } catch (error) {
        return false;
    }
}

async function insertSerie(tv: NonNullable<ValidatedSearchResult["tv"]>) {
    const serieCount = await prisma.serie.count({
        where: {
            tmdb_id: tv.id,
        },
    });

    if (serieCount > 0) return true;

    try {
        await prisma.serie.create({
            data: {
                tmdb_id: tv.id,
                title: tv.name,
                overview: tv.overview ?? "",
                season_count: tv.number_of_seasons,
                episode_count: tv.number_of_episodes,
                poster_path: tv.poster_path,
                backdrop_path: tv.backdrop_path,
                release_date: new Date(tv.first_air_date).toISOString(),
            },
        });
        return true;
    } catch (error) {
        return false;
    }
}

async function insertMovie(
    tmdbApiKey: string,
    movie: NonNullable<ValidatedSearchResult["movie"]>
) {
    // Find or create collection
    if (
        movie.belongs_to_collection &&
        !(await insertCollection(tmdbApiKey, movie.belongs_to_collection))
    ) {
        return null;
    }

    try {
        return await prisma.video.create({
            data: {
                title: movie.title,
                tmdb_id: movie.id,
                duration: movie.runtime,
                overview: movie.overview ?? "",
                poster_path: movie.poster_path,
                release_date: new Date(movie.release_date).toISOString(),
                backdrop_path: movie.backdrop_path,
                tmdb_collection_id: movie.belongs_to_collection?.id,
            },
        });
    } catch (error) {
        return null;
    }
}

async function insertCollection(
    tmdbApiKey: string,
    belongs_to_collection: NonNullable<
        NonNullable<ValidatedSearchResult["movie"]>["belongs_to_collection"]
    >
) {
    const movieDb = new MovieDb(tmdbApiKey);
    const collectionCount = await prisma.collection.count({
        where: {
            tmdb_id: belongs_to_collection.id,
        },
    });

    if (collectionCount > 0) return true;

    try {
        const collection = await movieDb.collectionInfo(
            belongs_to_collection.id
        );
        await prisma.collection.create({
            data: {
                tmdb_id: collection.id!,
                title: collection.name!,
                overview: collection.overview!,
                backdrop_path: collection.backdrop_path!,
                poster_path: collection.poster_path!,
            },
        });
        return true;
    } catch (error) {
        return false;
    }
}
