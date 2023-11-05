"use client";

import React, { useContext } from "react";

import { formatTime, formatYear } from "@/format";
import { SearchResult } from "@/tmdb/search";
import clsx from "clsx";

import { VideoContext } from "./VideoProvider";

export default function VideoUploadSearchCard({
    result,
    closeModal,
}: {
    result: SearchResult;
    closeModal: () => void;
}) {
    const { currentResult, setCurrentResult } = useContext(VideoContext);

    const movieSeries = result.movieSeries;
    const episode = result.episode;

    return (
        <div
            className={clsx(
                "w-full rounded-xl p-3",
                movieSeries.id === currentResult?.movieSeries.id &&
                    episode?.season_number ===
                        currentResult?.episode?.season_number &&
                    episode?.episode_number ===
                        currentResult?.episode?.episode_number
                    ? "bg-primary"
                    : "cursor-pointer bg-tertiary"
            )}
            onClick={() => {
                if (
                    currentResult?.movieSeries.id === movieSeries.id &&
                    currentResult?.episode?.id === episode?.id
                )
                    return;

                setCurrentResult(() => result);
                closeModal();
            }}
        >
            <h1 className="font-medium text-text">
                {movieSeries.media_type === "movie"
                    ? movieSeries.title
                    : movieSeries.name}{" "}
                <span className="text-text-dark">
                    (
                    {formatYear(
                        (movieSeries.media_type === "movie"
                            ? movieSeries.release_date
                            : movieSeries.first_air_date) ?? ""
                    )}
                    )
                </span>
            </h1>
            <p className="line-clamp-2 text-sm text-text-dark">
                {movieSeries.overview}
            </p>
            {episode && (
                <div className="mt-2">
                    <h2 className="font-medium text-text">
                        S{episode.season_number}E{episode.episode_number} -{" "}
                        {episode.name} •{" "}
                        {formatTime((episode.runtime || 0) * 60)}
                    </h2>
                    <p className="line-clamp-2 text-sm text-text-dark">
                        {episode.overview}
                    </p>
                </div>
            )}
        </div>
    );
}
