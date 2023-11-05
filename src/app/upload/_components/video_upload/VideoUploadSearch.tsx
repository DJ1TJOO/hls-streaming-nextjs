"use client";

import React, { Fragment, useContext, useRef, useState } from "react";

import { formatTime, formatYear } from "@/format";
import { search } from "@/tmdb/search";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import { VideoContext } from "./VideoProvider";
import VideoUploadSearchCard from "./VideoUploadSearchCard";

export default function VideoUploadSearch({
    container,
}: {
    container: React.MutableRefObject<HTMLDivElement | null>;
}) {
    const { searchResults, currentResult, setSearchResults } =
        useContext(VideoContext);
    const button = useRef<HTMLButtonElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const title =
        currentResult?.movieSeries.media_type === "movie"
            ? currentResult.movieSeries.title
            : currentResult?.movieSeries.name;

    async function searchQuery() {
        const searchResults = await search(query);
        console.log(searchResults);

        setSearchResults(searchResults);
    }

    return (
        <>
            <button
                type="button"
                ref={button}
                onClick={openModal}
                className="flex gap-2 rounded-xl bg-secondairy py-2 pl-3 pr-4 text-sm text-text outline-none"
            >
                {title}
                {currentResult?.episode &&
                    ` - S${currentResult.episode.season_number}E${currentResult.episode.episode_number}`}
            </button>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div
                        className="fixed"
                        style={{
                            top: button.current?.getBoundingClientRect().bottom,
                            left: button.current?.getBoundingClientRect().left,
                        }}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                style={{
                                    width: container.current?.getBoundingClientRect()
                                        .width,
                                    minHeight:
                                        (container.current?.getBoundingClientRect()
                                            .height || 0) -
                                        (button.current?.getBoundingClientRect()
                                            .height || 0),
                                }}
                                className="relative mt-2 flex origin-top-left transform flex-col gap-1 overflow-hidden rounded-2xl bg-secondairy px-3 pt-3 text-left align-middle shadow-lg ring-1 ring-black/5 transition-all focus:outline-none"
                            >
                                <div className="flex w-full gap-1">
                                    <input
                                        type="text"
                                        className="w-full rounded-xl px-3 py-1 outline-none"
                                        onKeyDown={(e) =>
                                            e.code === "Enter" && searchQuery()
                                        }
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                    />
                                    <button
                                        onClick={searchQuery}
                                        className="flex items-center gap-2 rounded-xl bg-action py-2 pl-3 pr-4 text-sm text-text"
                                    >
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                        Search
                                    </button>
                                </div>
                                <div className="absolute left-0 top-[3.25rem] z-10 h-2 min-h-[0.25rem] w-full bg-gradient-to-b from-secondairy"></div>
                                <div className="scrollbar-none flex max-h-80 flex-col gap-2 overflow-y-auto pb-3 pt-2">
                                    {currentResult && (
                                        <VideoUploadSearchCard
                                            result={currentResult}
                                            closeModal={closeModal}
                                        />
                                    )}
                                    {searchResults?.results
                                        .filter(
                                            (x) =>
                                                !(
                                                    x.movieSeries.id ===
                                                        currentResult
                                                            ?.movieSeries.id &&
                                                    x.episode?.season_number ===
                                                        currentResult?.episode
                                                            ?.season_number &&
                                                    x.episode
                                                        ?.episode_number ===
                                                        currentResult?.episode
                                                            ?.episode_number
                                                )
                                        )
                                        .map((x) => (
                                            <VideoUploadSearchCard
                                                key={x.movieSeries.id}
                                                result={x}
                                                closeModal={closeModal}
                                            />
                                        ))}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
