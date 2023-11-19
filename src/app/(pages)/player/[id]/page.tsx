import prisma from "@/db";
import { getStoreDirectory } from "@/transcode/store";
import path from "path";

import VideoPlayer from "./_components/VideoPlayer";

export default async function Home({ params }: { params: { id: string } }) {
    const video = await prisma.video.findFirst({
        where: {
            id: params.id,
        },
        include: {
            season: true,
            serie: true,
            collection: true,
        },
    });

    if (video === null) return null;
    const test = path.join(
        getStoreDirectory("/content/", video),
        "master.m3u8"
    );

    // console.log(video, test);

    return <VideoPlayer url={test}></VideoPlayer>;
}
