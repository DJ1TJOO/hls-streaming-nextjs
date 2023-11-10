import React, { useEffect, useRef, useState } from "react";

import TmdbImage from "@/app/_components/TmdbImage";
import { Video } from "@/db";
import { map } from "@/map";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { Serie } from "@prisma/client";

import HeaderBackground from "./HeaderBackground";

export default function Header({ media }: { media: Video | Serie }) {
    return (
        <HeaderBackground media={media}>
            <div className="relative z-10 flex w-full flex-col gap-2">
                <h1 className="text-2xl font-medium text-text">
                    {media.title}
                </h1>
                <p className="line-clamp-2 text-text-dark">{media.overview}</p>
            </div>
            <div className="relative z-10 flex w-full gap-3 sm:justify-end">
                {/* TODO: add functionality */}
                <button
                    type="button"
                    className="flex gap-2 rounded-xl bg-action py-2 pl-3 pr-4 text-sm text-text"
                >
                    <PlayIcon className="h-5 w-5" />
                    Watch
                </button>
                <button
                    type="button"
                    className="flex gap-2 rounded-xl bg-secondairy py-2 pl-3 pr-4 text-sm text-text"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add to list
                </button>
            </div>
        </HeaderBackground>
    );
}
