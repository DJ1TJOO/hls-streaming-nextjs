import { cache } from "react";

import { MovieDb } from "moviedb-promise";
import "server-only";

export const preload = () => {
    void getTmdbConfiguration();
};

export const getTmdbConfiguration = cache(async () => {
    if (typeof process.env.TMDB_API_KEY !== "string") return null;
    const db = new MovieDb(process.env.TMDB_API_KEY);

    return await db.configuration();
});
