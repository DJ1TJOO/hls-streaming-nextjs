import { Video } from "@/db";
import { formatName, formatYear } from "@/format";
import { Collection, Season, Serie } from "@prisma/client";
import path from "path";

export function getStoreDirectory(
    base: string,
    video: Video & {
        collection: Collection | null;
        season: Season | null;
        serie: Serie | null;
    }
) {
    let storeDirectory = base;
    if (video.collection) {
        storeDirectory = path.join(
            storeDirectory,
            `collection_${formatName(video.collection.title)}_${
                video.collection.id
            }`
        );
    }

    if (video.serie) {
        storeDirectory = path.join(
            storeDirectory,
            `serie_${formatName(video.serie.title)}_${formatYear(
                video.serie.release_date
            )}_${video.serie.id}`
        );

        if (video.season) {
            storeDirectory = path.join(
                storeDirectory,
                `s${video.season.tmdb_season_nr}_${video.season.id}`
            );
        }
    }

    if (video.isEpisode) {
        // Episode
        storeDirectory = path.join(
            storeDirectory,
            `s${video.tmdb_season_nr}e${video.tmdb_episode_nr}_${formatName(
                video.title
            )}_${video.id}`
        );
    } else {
        // Movie
        storeDirectory = path.join(
            storeDirectory,
            `movie_${formatName(video.title)}_${video.id}`
        );
    }

    return storeDirectory;
}
