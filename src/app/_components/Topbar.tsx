import React from "react";

import { BellIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

import NotificationMenu from "./notifications/NotificationMenu";
import SearchBar from "./search/SearchBar";

export default function Topbar() {
    return (
        <header className="flex h-14 w-full items-center justify-between">
            <div className="flex items-center gap-4">
                <ChevronLeftIcon className="h-6 w-6 text-text" />
                <SearchBar />
            </div>
            <NotificationMenu
                button={
                    <div className="rounded-2xl bg-secondairy p-2.5 text-text">
                        <BellIcon className="h-5 w-5" />
                    </div>
                }
            >
                asasfaf
            </NotificationMenu>
        </header>
    );
}
