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

    const episode = result.episode;
    const isCurrent =
        result.tv?.id === currentResult?.tv?.id &&
        result.movie?.id === currentResult?.movie?.id &&
        episode?.season_number === currentResult?.episode?.season_number &&
        episode?.episode_number === currentResult?.episode?.episode_number;

    const title = result.movie?.title ?? result.tv?.name;
    const description = result.movie?.overview ?? result.tv?.overview;
    const year = result.movie?.release_date ?? result.tv?.first_air_date ?? "";

    return (
        <div
            className={clsx(
                "w-full rounded-xl p-3",
                isCurrent ? "bg-primary" : "cursor-pointer bg-tertiary"
            )}
            onClick={() => {
                if (isCurrent) return;

                setCurrentResult(() => result);
                closeModal();
            }}
        >
            <h1 className="font-medium text-text">
                {title}{" "}
                <span className="text-text-dark">({formatYear(year)})</span>
            </h1>
            <p className="line-clamp-2 text-sm text-text-dark">{description}</p>
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
