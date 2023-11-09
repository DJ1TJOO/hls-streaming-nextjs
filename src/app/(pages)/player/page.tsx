"use client";

import { useEffect, useRef } from "react";

import Hls from "hls.js";

export default function Home() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const src =
        "/content/videos/6b2c7118-8c52-4bbe-8ca5-fb4f5d43d0b4/master.m3u8";

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.controls = true;

        // Load hls video
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            return;
        }

        if (!Hls.isSupported()) {
            console.error(
                "This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API"
            );
            return;
        }

        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
            console.log(hls.levels);

            const select = selectRef.current;
            if (!select) return;
            select.innerText = "";

            const levelNames = ["low", "medium", "high"];
            const levels = hls.levels.sort((x) => x.width);

            for (let i = 0; i < levels.length; i++) {
                const option = document.createElement("option");
                option.value = i + "";

                const name = levels.length > 3 ? i.toString() : levelNames[i];
                option.append(name);
                select.append(option);
            }

            select.addEventListener("change", () => {
                hls.nextLevel = parseInt(select.value);
            });
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
            console.log(data);

            const select = selectRef.current;
            if (!select) return;
            select.value = data.level + "";
        });

        return () => {
            hls.removeAllListeners();
        };
    }, [src, videoRef]);

    return (
        <main className="">
            <video ref={videoRef} /> <select ref={selectRef}></select>
        </main>
    );
}
