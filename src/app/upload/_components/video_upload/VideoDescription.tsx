import React, { useContext } from "react";

import { formatTime, formatYear } from "@/format";

import { VideoContext } from "./VideoProvider";

export default function VideoDescription() {
    const { currentResult } = useContext(VideoContext);

    if (!currentResult)
        return (
            <div className="flex gap-3">
                <div className="flex w-full flex-col gap-1">
                    <div className="h-7 w-1/3 animate-pulse rounded-md bg-tertiary" />
                    <div className="flex w-full flex-col gap-1">
                        <div className="animation-delay-150 h-5 w-full animate-pulse rounded bg-tertiary" />
                        <div className="animation-delay-300 h-5 w-full animate-pulse rounded bg-tertiary" />
                        <div className="animation-delay-500 h-5 w-4/5 animate-pulse rounded bg-tertiary" />
                    </div>
                </div>
            </div>
        );

    const title = currentResult.movie?.title ?? currentResult.tv?.name;
    const description =
        currentResult.movie?.overview ?? currentResult.tv?.overview;
    const year =
        currentResult.movie?.release_date ??
        currentResult.tv?.first_air_date ??
        "";

    return (
        <div className="flex gap-3">
            <div className="flex w-full flex-col gap-1">
                <h1 className="text-xl font-medium text-text">
                    {title}{" "}
                    <span className="text-text-dark">({formatYear(year)})</span>
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
