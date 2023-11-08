"use client";

import React, { PropsWithChildren } from "react";

import clsx from "clsx";
import { usePathname } from "next/navigation";

import { CanLeaveLink } from "../CanLeaveProvider";

export default function NavButton({
    path,
    children,
}: PropsWithChildren<{
    path: string;
}>) {
    const currentPath = usePathname();
    return (
        <CanLeaveLink
            href={path}
            className={clsx(
                "flex w-full gap-3 rounded-2xl px-3 py-3.5 text-sm text-text",
                path === currentPath && "bg-action"
            )}
        >
            {children}
        </CanLeaveLink>
    );
}
