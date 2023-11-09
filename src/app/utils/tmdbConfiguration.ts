import { cache } from "react";

import { MovieDb } from "moviedb-promise";
import "server-only";

import {
    TmdbConfiguration,
    defaultTmdbConfiguration,
} from "./tmdbConfigurationDefault";

export const preload = () => {
    void getTmdbConfiguration();
};

async function fetchTmdbConfiguration() {
    if (typeof process.env.TMDB_API_KEY !== "string") return null;
    const db = new MovieDb(process.env.TMDB_API_KEY);
    return await db.configuration();
}

export const getTmdbConfiguration = cache(async () => {
    let configuration = await fetchTmdbConfiguration();

    if (configuration === null) configuration = defaultTmdbConfiguration;
    else {
        configuration["images"] = {
            ...defaultTmdbConfiguration["images"],
            ...configuration["images"],
        };
    }

    return configuration as TmdbConfiguration;
});
