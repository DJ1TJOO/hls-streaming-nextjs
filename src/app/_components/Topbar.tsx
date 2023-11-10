import React from "react";

import { BellIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

import NotificationMenu from "./notifications/NotificationMenu";
import SearchBar from "./search/SearchBar";

export default function Topbar() {
    return (
        <header className="sticky top-0 z-40 -mx-6 flex h-[5rem] shrink-0 items-center justify-between gap-2 bg-primary px-6 pt-4 shadow-primary after:absolute after:-bottom-4 after:left-0 after:h-4 after:w-full after:bg-gradient-to-b after:from-primary sm:-ml-4 sm:pl-4 sm:pt-6">
            <div className="flex w-full items-center gap-4">
                <ChevronLeftIcon className="h-6 w-6 shrink-0 text-text" />
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
