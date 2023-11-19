"use client";

import React, { Fragment, ReactNode, useState } from "react";

import { Transition } from "@headlessui/react";

export default function VideoPlayerActionIcon({
    showing,
    icon,
    hideActionIcon,
}: ReturnType<typeof useActionIcon>) {
    return (
        <Transition
            show={showing}
            as={Fragment}
            enter="transform transition duration-200"
            enterFrom="opacity-0 scale-80"
            enterTo="opacity-100 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            afterEnter={() => hideActionIcon(true)}
            afterLeave={() => hideActionIcon(false)}
        >
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-primary/50 p-3 text-text">
                {icon}
            </div>
        </Transition>
    );
}

export function useActionIcon() {
    const [actionIcon, setActionIcon] = useState<ReactNode | null>(null);
    const [showedAction, setShowedAction] = useState(true);

    const showing = !showedAction && actionIcon !== null;
    function showActionIcon(icon: ReactNode) {
        if (!showing) setShowedAction(false);
        setActionIcon(icon);
    }

    function hideActionIcon(animate: boolean) {
        if (animate) {
            setShowedAction(true);
        } else {
            setActionIcon(null);
        }
    }

    return {
        showing,
        icon: actionIcon,
        showActionIcon,
        hideActionIcon,
    };
}
