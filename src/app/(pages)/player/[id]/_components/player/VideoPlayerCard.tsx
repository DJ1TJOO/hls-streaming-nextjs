"use client";

import React, { Fragment, PropsWithChildren, RefObject } from "react";

import { Dialog, Transition } from "@headlessui/react";

export default function VolumeCard({
    button,
    isOpen,
    closeModal,
    children,
}: PropsWithChildren<{
    button: RefObject<HTMLButtonElement>;
    isOpen: boolean;
    closeModal: () => void;
}>) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div
                    className="fixed"
                    style={{
                        top: button.current?.getBoundingClientRect().top,
                        left: button.current
                            ? button.current.getBoundingClientRect().left +
                              button.current.getBoundingClientRect().width
                            : 0,
                    }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="flex w-56 origin-bottom-right -translate-x-full -translate-y-full flex-col overflow-hidden rounded-2xl bg-secondairy p-3 text-text shadow-lg ring-1 ring-black/5 focus:outline-none">
                            {children}
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
