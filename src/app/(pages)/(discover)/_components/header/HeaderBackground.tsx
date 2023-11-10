"use client";

import React, {
    PropsWithChildren,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import TmdbImage from "@/app/_components/TmdbImage";
import { Video } from "@/db";
import { map } from "@/map";
import { Serie } from "@prisma/client";

export default function HeaderBackground({
    children,
    media,
}: PropsWithChildren<{ media: Video | Serie }>) {
    const container = useRef<HTMLDivElement | null>(null);

    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = useCallback(() => {
        const scroll = window.scrollY ?? 0;

        const position = map(
            scroll ?? 0,
            0,
            container.current?.clientHeight ?? 0,
            0,
            20
        );

        setScrollPosition(position);
    }, [container.current]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            ref={container}
            className="relative flex aspect-[2/3] max-h-[50vh] w-full shrink-0 flex-col justify-end gap-3 overflow-hidden rounded-b-lg rounded-t-3xl p-6 after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:bg-gradient-to-t after:from-black after:to-transparent after:to-50% sm:aspect-[9/4] sm:flex-row sm:items-end"
        >
            <TmdbImage
                src={media.backdrop_path ?? ""}
                type="backdrop_sizes"
                layout="fill"
                className="object-cover object-top"
                style={{
                    transform: `translateY(${scrollPosition}%) scale(1.1)`,
                }}
                alt="video"
            />
            {children}
        </div>
    );
}
