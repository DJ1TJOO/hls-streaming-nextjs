import React, { useContext } from "react";

import { formatTime, formatYear } from "@/format";

import { VideoContext } from "./VideoProvider";

export default function VideoDescription() {
    const { currentResult } = useContext(VideoContext);

    if (!currentResult) return <div className="flex gap-3"></div>;

    const title =
        currentResult.result.media_type === "movie"
            ? currentResult.result.title
            : currentResult.result.name;
    const description = currentResult.result.overview;

    return (
        <div className="flex gap-3">
            <div className="flex w-full flex-col gap-1">
                <h1 className="text-xl font-medium text-text">
                    {title}{" "}
                    <span className="text-text-dark">
                        (
                        {formatYear(
                            (currentResult.result.media_type === "movie"
                                ? currentResult.result.release_date
                                : currentResult.result.first_air_date) ?? ""
                        )}
                        )
                    </span>
                </h1>
                <p className="text-sm text-text-dark">{description}</p>
            </div>
            {currentResult.episode &&
                currentResult.result.media_type === "tv" && (
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
