"use client";

import React, { useContext } from "react";

import { TmdbConfigurationContext } from "@/app/_components/providers/TmdbConfigurationProvider";

export default function Header() {
    const configuration = useContext(TmdbConfigurationContext);

    return <div>Header</div>;
}
