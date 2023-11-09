import React, { useContext } from "react";

import { getTmdbConfiguration } from "@/app/utils/tmdbConfiguration";

export default async function Header() {
    const configuration = await getTmdbConfiguration();

    return <div>Header</div>;
}
