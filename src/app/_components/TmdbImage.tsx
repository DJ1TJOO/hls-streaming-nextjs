"use client";

import React, { ComponentProps, useContext, useMemo, useState } from "react";

import { findClosest } from "@/findClosest";
import Image from "next/image";

import { TmdbConfiguration } from "../utils/tmdbConfigurationDefault";
import { TmdbConfigurationContext } from "./providers/TmdbConfigurationProvider";

// Custom backdrops the tmdb pages use
const backdropSpecials = [
    // aspect 1:2.4
    "1920_and_h800_multi_faces",
    "1920_and_h800_face",

    // aspect 1:3.1
    "1400_and_h450_multi_faces",
    "1400_and_h450_face",
];

export default function TmdbImage({
    type,
    ...props
}: ComponentProps<typeof Image> & {
    type: keyof Omit<
        TmdbConfiguration["images"],
        "base_url" | "secure_base_url"
    >;
}) {
    const isBanner = type === "backdrop_sizes";
    const configuration = useContext(TmdbConfigurationContext);
    const [backdropSpecial, setBackdropSpecial] = useState<number>(
        isBanner ? 0 : -1
    );
    const supportedWidths = useMemo(
        () =>
            configuration.images[type]
                .map((x) => Number(x.replace("w", "")))
                .filter(Boolean),
        [type, configuration.images[type]]
    );

    return (
        <Image
            {...props}
            loader={({ src, width, quality }) => {
                const supportedWidth = findClosest(supportedWidths, width);
                const useBannerSpecial =
                    isBanner &&
                    backdropSpecial >= 0 &&
                    backdropSpecial < backdropSpecials.length;

                return `${configuration.images.secure_base_url}w${
                    useBannerSpecial
                        ? backdropSpecials[backdropSpecial]
                        : supportedWidth
                }${src}`;
            }}
            onError={() => {
                if (!isBanner) return;
                setBackdropSpecial((prev) => prev + 1);
            }}
        />
    );
}
