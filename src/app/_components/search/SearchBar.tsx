import React from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar() {
    return (
        <label className="flex cursor-text items-center gap-3 rounded-2xl border border-text-dark px-4 py-2.5 text-text-dark">
            <MagnifyingGlassIcon className="h-5 w-5" />
            <input
                className="w-80 bg-transparent text-sm outline-none"
                placeholder="Search for movies, series and more"
            />
        </label>
    );
}
