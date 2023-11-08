"use client";

import React, {
    ComponentProps,
    Fragment,
    PropsWithChildren,
    createContext,
    useContext,
    useRef,
    useState,
} from "react";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const CanLeaveContext = createContext<boolean>(true);

function canLeavePage(href: string) {
    return !href.includes("upload");
}

export default function CanLeaveProvider({ children }: PropsWithChildren) {
    const path = usePathname();

    return (
        <CanLeaveContext.Provider value={canLeavePage(path)}>
            {children}
        </CanLeaveContext.Provider>
    );
}

export function CanLeaveLink({
    children,
    ...props
}: ComponentProps<typeof Link>) {
    const canLeave = useContext(CanLeaveContext);
    const [isOpen, setIsOpen] = useState(false);
    const cancelButtonRef = useRef(null);
    const router = useRouter();

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const { onClick, href, ...divProps } = props;

    if (canLeave || !canLeavePage(href.toString()))
        return <Link {...props}>{children}</Link>;

    return (
        <>
            <a
                {...divProps}
                onClick={() => {
                    openModal();
                }}
                role="button"
            >
                {children}
            </a>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    initialFocus={cancelButtonRef}
                    as="div"
                    className="relative z-20"
                    onClose={closeModal}
                >
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

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="relative flex max-w-md transform flex-col gap-1 overflow-hidden rounded-2xl bg-secondairy p-3 text-left align-middle shadow-lg ring-1 ring-black/5 transition-all focus:outline-none">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-text"
                                    >
                                        Are you sure?
                                    </Dialog.Title>
                                    <p className="mt-2 text-sm text-text-dark">
                                        Changes you have made may not be saved.
                                    </p>

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            className="flex gap-2 rounded-xl bg-tertiary px-3 py-2 text-sm text-text outline-none"
                                            onClick={() => {
                                                closeModal();
                                                router.push(href.toString());
                                            }}
                                        >
                                            Continue
                                        </button>
                                        <button
                                            type="button"
                                            className="flex gap-2 rounded-xl bg-action px-3 py-2 text-sm text-text outline-none"
                                            onClick={closeModal}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
