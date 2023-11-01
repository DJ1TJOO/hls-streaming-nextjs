import React from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar() {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-text-dark px-4 py-2 text-text-dark">
            <MagnifyingGlassIcon className="h-6 w-6" />
            <input
                className="w-80 bg-transparent outline-none"
                placeholder="Search for movies, series and more"
            />
        </div>
    );
}
