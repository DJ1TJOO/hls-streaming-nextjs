import prisma from "@/db";

import Header from "./_components/header/Header";
import PosterSection from "./_components/posterSection/PosterSection";

export default async function Home() {
    // TODO: get actual video
    const video = await prisma.video.findFirst({
        orderBy: {
            duration: "desc",
        },
    });
    const serie = await prisma.serie.findFirst();
    if (video === null || serie === null) return null;
    return (
        <>
            <Header media={serie} />
            <PosterSection label={"Trending"} />
            <PosterSection label={"Trending"} />
        </>
    );
}
