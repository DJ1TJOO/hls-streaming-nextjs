import React from "react";

import TmdbImage from "@/app/_components/TmdbImage";
import prisma from "@/db";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import PosterSectionScroller from "./PosterSectionScroller";

export default async function PosterSection({ label }: { label: string }) {
    // TODO: get actual video
    const video = await prisma.video.findFirst({
        orderBy: {
            duration: "desc",
        },
    });
    const serie = await prisma.serie.findFirst();
    if (video === null || serie === null) return null;

    return (
        <div className="-ml-6 -mr-6 flex flex-col gap-1 sm:-ml-4">
            <h2 className="pl-4 text-xl font-medium text-text">{label}</h2>
            <div className="relative">
                <PosterSectionScroller>
                    {[...Array(20)].map((x) => (
                        <button className="relative flex aspect-[2/3] h-96 shrink-0 items-end overflow-hidden rounded-b-lg rounded-t-2xl outline-none">
                            <TmdbImage
                                src={video.poster_path ?? ""}
                                type="poster_sizes"
                                layout="fill"
                                className="object-cover"
                                alt="poster"
                            />
                            <div
                                className="z-10 h-1 bg-action"
                                style={{ width: 60 + "%" }}
                            />
                        </button>
                    ))}
                </PosterSectionScroller>
            </div>
        </div>
    );
}
