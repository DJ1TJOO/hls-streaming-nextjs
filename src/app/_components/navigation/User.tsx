import React from "react";

import { ChevronDownIcon, UserIcon } from "@heroicons/react/24/outline";

import UserMenu from "./UserMenu";

export default function User({
    username,
    email,
}: {
    username: string;
    email: string;
}) {
    return (
        <UserMenu>
            <div className="flex w-full items-center justify-between gap-3 rounded-2xl bg-secondairy p-4 text-text">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-text p-1">
                        <UserIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-medium leading-none">
                            {username}
                        </span>
                        <span className="flex-1 truncate text-xs text-text-dark">
                            {email}
                        </span>
                    </div>
                </div>
                <ChevronDownIcon className="h-6 w-6" />
            </div>
        </UserMenu>
    );
}
