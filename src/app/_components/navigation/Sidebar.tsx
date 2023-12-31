import React from "react";

import {
    AdjustmentsHorizontalIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    DocumentArrowUpIcon,
    GlobeAltIcon,
    TicketIcon,
} from "@heroicons/react/24/outline";

import NavSection from "./NavSection";
import User from "./User";

export default function Sidebar() {
    return (
        <nav className="flex h-full w-56 shrink-0 flex-col gap-4 overflow-y-auto">
            <header className="flex h-14 min-h-[3.5rem] items-center gap-3 text-text">
                <TicketIcon className="aspect-square h-full" />
                <span className="text-xl font-medium">STREAMER</span>
            </header>
            <User username={"Thomas"} email={"t.ferb1@gmail.com"} />
            <div className="flex flex-col gap-6">
                <NavSection
                    label={"Menu"}
                    buttons={[
                        {
                            icon: <GlobeAltIcon className="h-5 w-5" />,
                            label: "Discover",
                            url: "/",
                        },
                        {
                            icon: <Bars3Icon className="h-5 w-5" />,
                            label: "My List",
                            url: "/list",
                        },
                        {
                            icon: <DocumentArrowUpIcon className="h-5 w-5" />,
                            label: "Upload",
                            url: "/upload",
                        },
                    ]}
                />
                <NavSection
                    label={"General"}
                    buttons={[
                        {
                            icon: (
                                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                            ),
                            label: "Settings",
                            url: "/settings",
                        },
                        {
                            icon: (
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            ),
                            label: "Logout",
                            url: "/logout",
                        },
                    ]}
                />
            </div>
        </nav>
    );
}
