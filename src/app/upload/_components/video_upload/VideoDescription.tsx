import React, { useContext } from "react";

import { formatTime, formatYear } from "@/format";

import { VideoContext } from "./VideoProvider";

export default function VideoDescription() {
    const { currentResult } = useContext(VideoContext);

    if (!currentResult) return <div className="flex gap-3"></div>;

    const title =
        currentResult.movieSeries.media_type === "movie"
            ? currentResult.movieSeries.title
            : currentResult.movieSeries.name;
    const description = currentResult.movieSeries.overview;

    return (
        <div className="flex gap-3">
            <div className="flex w-full flex-col gap-1">
                <h1 className="text-xl font-medium text-text">
                    {title}{" "}
                    <span className="text-text-dark">
                        (
                        {formatYear(
                            (currentResult.movieSeries.media_type === "movie"
                                ? currentResult.movieSeries.release_date
                                : currentResult.movieSeries.first_air_date) ??
                                ""
                        )}
                        )
                    </span>
                </h1>
                <p className="text-sm text-text-dark">{description}</p>
            </div>
            {currentResult.episode && (
                <div className="flex w-full flex-col gap-1">
                    <h1 className="text-xl font-medium text-text">
                        {currentResult.episode.name}{" "}
                        <span className="text-text-dark">
                            •{" "}
                            {formatTime(
                                (currentResult.episode.runtime || 0) * 60
                            )}
                        </span>
                    </h1>
                    <p className="text-sm text-text-dark">
                        {currentResult.episode.overview}
                    </p>
                </div>
            )}
        </div>
    );
}
