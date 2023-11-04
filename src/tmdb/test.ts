import { config } from "dotenv";
import { MovieDb } from "moviedb-promise";

config();

const db = new MovieDb(process.env.TMDB_API_KEY!);

// db.searchMulti({
//     query: "The Equalizer",
// })
//     .then((res) => {
//         console.log(res);
//     })
//     .catch(console.error);
// db.movieInfo(156022)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch(console.error);
// db.collectionInfo(523855)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch(console.error);
// db.tvInfo(37680)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch(console.error);
// db.seasonInfo({
//     id: 37680,
//     season_number: 1,
// })
//     .then((res) => {
//         console.log(res);
//     })
//     .catch(console.error);

// db.episodeInfo({
//     id: 37680,
//     season_number: 1,
//     episode_number: 1,
// })
//     .then((res) => {
//         console.log(res);
//     })
//     .catch(console.error);
