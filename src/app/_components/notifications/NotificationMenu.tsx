"use client";

import React, { Fragment, PropsWithChildren } from "react";

import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function NotificationMenu({
    children,
    button,
}: PropsWithChildren<{ button: React.ReactNode }>) {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button className={"outline-none"}>
                        {button}
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Popover.Panel
                            focus
                            className="buttom-0 absolute right-0 z-20 origin-top-right"
                        >
                            <div className="w-56 overflow-hidden rounded-md bg-secondairy p-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                {children}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
