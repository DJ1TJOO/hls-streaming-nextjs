import React, { Fragment, ReactNode } from "react";

import { Transition } from "@headlessui/react";

export default function VideoPlayerButtonTransition({
    show,
    iconEnabled,
    iconDisabled,
}: {
    show: boolean;
    iconEnabled: ReactNode;
    iconDisabled: ReactNode;
}) {
    return (
        <div className="relative h-5 w-5">
            <Transition
                show={show}
                as={Fragment}
                enter="transform transition duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transform duration-200 transition ease-in-out"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2">
                    {iconEnabled}
                </div>
            </Transition>
            <Transition
                show={!show}
                as={Fragment}
                enter="transform transition duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transform duration-200 transition ease-in-out"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2">
                    {iconDisabled}
                </div>
            </Transition>
        </div>
    );
}
