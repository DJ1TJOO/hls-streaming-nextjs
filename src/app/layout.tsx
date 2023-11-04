import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Topbar from "./_components/Topbar";
import Sidebar from "./_components/navigation/Sidebar";
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
            <body
                className={clsx(
                    inter.className,
                    "flex h-screen gap-4 bg-primary p-8"
                )}
            >
                <Sidebar />
                <main className="relative flex h-full w-full flex-col gap-4">
                    <Topbar />
                    <div className="absolute top-14 z-10 h-4 min-h-[1rem] w-full bg-gradient-to-b from-primary"></div>
                    <div className="scrollbar-none -mt-4 flex flex-col gap-6 overflow-y-auto pb-6 pr-6 pt-4 filter">
                        {children}
                    </div>
                </main>
            </body>
        </html>
    );
}
