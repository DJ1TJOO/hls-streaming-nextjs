import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Topbar from "./_components/Topbar";
import Sidebar from "./_components/navigation/Sidebar";
import AppProvider from "./_components/providers/AppProvider";
import CanLeaveProvider from "./_components/providers/CanLeaveProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <AppProvider>
                <body
                    className={clsx(
                        inter.className,
                        "scrollbar-none flex w-full flex-col gap-4 overscroll-y-auto bg-primary px-6 sm:flex-row"
                    )}
                >
                    <Sidebar />
                    <div className="flex w-full flex-col gap-4 sm:w-[calc(100%-14rem-1rem)]">
                        <Topbar />
                        <main className="flex flex-col gap-6 pb-6">
                            {children}
                        </main>
                    </div>
                </body>
            </AppProvider>
        </html>
    );
}
