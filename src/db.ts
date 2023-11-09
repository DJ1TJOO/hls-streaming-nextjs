import { PrismaClient, Video as VideoWithoutExtends } from "@prisma/client";

export type Video = VideoWithoutExtends & {
    isMovie: boolean;
    isEpisode: boolean;
};

const prismaClientSingleton = () => {
    return new PrismaClient({
        // log: ["query", "info", "warn", "error"],
    }).$extends({
        result: {
            video: {
                isMovie: {
                    compute(video) {
                        return (
                            video.tmdb_serie_id === null ||
                            video.tmdb_season_nr === null ||
                            video.tmdb_episode_nr === null
                        );
                    },
                },
                isEpisode: {
                    compute(video) {
                        return (
                            video.tmdb_serie_id !== null &&
                            video.tmdb_season_nr !== null &&
                            video.tmdb_episode_nr !== null
                        );
                    },
                },
            },
        },
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
