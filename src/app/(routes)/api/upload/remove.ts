import prisma, { Video } from "@/db";

export async function remove(video: Video) {
    await prisma.video.delete({
        where: {
            id: video.id,
        },
    });

    // Delete season and serie/collection if not used by others
    try {
        if (video.tmdb_season_nr !== null && video.tmdb_serie_id !== null) {
            await prisma.season.delete({
                where: {
                    tmdb_serie_id_tmdb_season_nr: {
                        tmdb_serie_id: video.tmdb_serie_id,
                        tmdb_season_nr: video.tmdb_season_nr,
                    },
                },
            });
            await prisma.serie.delete({
                where: {
                    tmdb_id: video.tmdb_serie_id,
                },
            });
        }
    } catch (error) {}

    try {
        if (video.tmdb_collection_id !== null) {
            await prisma.collection.delete({
                where: {
                    tmdb_id: video.tmdb_collection_id,
                },
            });
        }
    } catch (error) {}
}
