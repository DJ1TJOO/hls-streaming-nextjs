import React, { PropsWithChildren } from "react";

import { getTmdbConfiguration } from "@/app/utils/tmdbConfiguration";

import CanLeaveProvider from "./CanLeaveProvider";
import TmdbConfigurationProvider, {
    TmdbConfiguration,
} from "./TmdbConfigurationProvider";

export default async function AppProvider({ children }: PropsWithChildren) {
    const tmdbConfiguration = await getTmdbConfiguration();

    return (
        <TmdbConfigurationProvider configuration={tmdbConfiguration}>
            <CanLeaveProvider>{children}</CanLeaveProvider>
        </TmdbConfigurationProvider>
    );
}
