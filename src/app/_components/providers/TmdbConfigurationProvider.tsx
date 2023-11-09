"use client";

import React, { PropsWithChildren, createContext } from "react";

import {
    TmdbConfiguration,
    defaultTmdbConfiguration,
} from "../../utils/tmdbConfiguration";

export const TmdbConfigurationContext = createContext<TmdbConfiguration>(
    defaultTmdbConfiguration
);

export default function TmdbConfigurationProvider({
    children,
    configuration,
}: PropsWithChildren<{ configuration: TmdbConfiguration }>) {
    return (
        <TmdbConfigurationContext.Provider
            value={configuration as TmdbConfiguration}
        >
            {children}
        </TmdbConfigurationContext.Provider>
    );
}
