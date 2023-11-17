import { SearchResult, searchWihId } from "@/tmdb/search";

import {
    ValidForm,
    ValidatedSearchResult,
    validateForm,
    validateSearchResult,
} from "./validate";

export default async function parse(data: FormData) {
    const files = data.getAll("file");
    const tmdbs = data.getAll("tmdb");

    // Make sure there is some
    if (files.length < 1) return null;
    if (tmdbs.length !== files.length) return null;

    const entries = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const tmdb = tmdbs[i];

        // Make sure file is not file and tmdb is not a file
        if (file instanceof File) return null;
        if (tmdb instanceof File) return null;

        // Make sure file is json data
        let fileParsed: any;
        try {
            fileParsed = JSON.parse(file);
        } catch (error) {
            return null;
        }

        // Make sure it has a name
        if (typeof fileParsed.name !== "string") {
            return null;
        }

        // Make sure tmdb is json data
        let tmdbParsed: any;
        try {
            tmdbParsed = JSON.parse(tmdb);
        } catch (error) {
            return null;
        }

        // Make sure it is a valid id
        if (!validateForm(tmdbParsed)) {
            return null;
        }

        const tmdbValid = tmdbParsed as ValidForm;
        const searchResult = await searchWihId(
            tmdbValid.tmdb_id,
            tmdbValid.tmdb_season_nr,
            tmdbValid.tmdb_episode_nr
        );

        // Make sure search result is valid
        if (searchResult === null || !validateSearchResult(searchResult)) {
            return null;
        }

        entries.push({
            fileName: fileParsed.name as string,
            tmdb: searchResult as ValidatedSearchResult,
        });
    }

    return entries;
}
