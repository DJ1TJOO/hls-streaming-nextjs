import prisma from "@/db";

import { ValidatedSearchResult } from "./validate";

export default async function inserted(tmdb: ValidatedSearchResult) {
    // Check movie inserted
    if (tmdb.movie) {
        const movie = await prisma.video.count({
            where: {
                tmdb_id: tmdb.movie.id,
            },
        });

        return movie > 0;
    }

    // Check episode inserted
    const episode = await prisma.video.count({
        where: {
            tmdb_serie_id: tmdb.tv.id,
            tmdb_season_nr: tmdb.episode.season_number,
            tmdb_episode_nr: tmdb.episode.episode_number,
        },
    });

    return episode > 0;
}
