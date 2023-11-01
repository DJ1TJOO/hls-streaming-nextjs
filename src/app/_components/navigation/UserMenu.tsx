"use client";

import React, { Fragment, PropsWithChildren } from "react";

import { Menu, Transition } from "@headlessui/react";

export default function UserMenu({ children }: PropsWithChildren) {
    return (
        <Menu as="div" className="relative">
            <div>
                <Menu.Button className={"w-full"}>{children}</Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                {/* TODO: dropdown */}
                <Menu.Items className="absolute right-0 mt-2 w-full origin-top divide-y divide-tertiary rounded-md bg-secondairy shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="px-1 py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`${
                                        active ? "bg-action " : ""
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm text-text`}
                                >
                                    TODO
                                </button>
                            )}
                        </Menu.Item>
                    </div>{" "}
                    <div className="px-1 py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`${
                                        active ? "bg-action " : ""
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm text-text`}
                                >
                                    TODO
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
