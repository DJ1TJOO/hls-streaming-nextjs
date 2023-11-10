"use client";

import React, {
    Fragment,
    PropsWithChildren,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { map } from "@/map";
import { Transition } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function PosterSectionScroller({ children }: PropsWithChildren) {
    const scrollable = useRef<HTMLDivElement>(null);

    const [showScrollLeft, setShowScrollLeft] = useState(false);
    const [showScrollRight, setShowScrollRight] = useState(true);

    const scroll = useCallback(
        (direction: number) => {
            const scroll = scrollable.current;
            if (!scroll) return;
            const target = scroll.getBoundingClientRect().left;

            const children = Array.from(scroll.children).filter(
                (x) =>
                    !x.hasAttribute("data-scroller") ||
                    !x.getAttribute("data-scroller") ||
                    !Boolean(x.getAttribute("data-scroller"))
            );

            const closest = children
                .map((x) => x.getBoundingClientRect().left)
                .reduce((prev, curr) =>
                    Math.abs(curr - target) < Math.abs(prev - target)
                        ? curr
                        : prev
                );

            const currentIndex = children.findIndex(
                (x) => x.getBoundingClientRect().left === closest
            );

            const child =
                children[(currentIndex + direction) % children.length];
            if (!child) return;

            child.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "start",
            });
        },
        [scrollable.current]
    );

    return (
        <div
            ref={scrollable}
            className="scrollbar-none flex w-full scroll-px-6 gap-3 overflow-x-auto px-6 sm:scroll-pl-4 sm:pl-4"
            onScroll={(e) => {
                if (!(e.target instanceof HTMLDivElement)) return;

                setShowScrollLeft(e.target.scrollLeft > 0);

                setShowScrollRight(
                    Math.ceil(e.target.scrollLeft + e.target.offsetWidth) <
                        e.target.scrollWidth
                );
            }}
        >
            {children}
            <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                show={showScrollLeft}
            >
                <button
                    data-scroller={true}
                    onClick={() => scroll(-1)}
                    className="absolute left-0 top-0 z-10 flex h-full origin-left cursor-pointer items-center bg-gradient-to-r from-primary from-10% px-3 text-text outline-none"
                >
                    <ChevronLeftIcon className="h-7 w-7" />
                </button>
            </Transition>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                show={showScrollRight}
            >
                <button
                    data-scroller={true}
                    onClick={() => scroll(1)}
                    className="absolute right-0 top-0  z-10 flex h-full origin-right cursor-pointer items-center bg-gradient-to-l from-primary from-10% px-3 text-text outline-none"
                >
                    <ChevronRightIcon className="h-7 w-7" />
                </button>
            </Transition>
        </div>
    );
}
