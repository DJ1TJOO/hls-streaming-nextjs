"use client";

import React, { PropsWithChildren } from "react";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavButton({
    path,
    children,
}: PropsWithChildren<{
    path: string;
}>) {
    const currentPath = usePathname();
    return (
        <Link
            href={path}
            className={clsx(
                "flex w-full gap-3 rounded-2xl p-3 text-sm text-text",
                path === currentPath && "bg-action"
            )}
        >
            {children}
        </Link>
    );
}
