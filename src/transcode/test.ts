import { Logger } from "@/logger";

import { RelativeMaster } from "./realativeMaster";
import { Transcoder } from "./transcoder";

const transcoder = new Transcoder(
    "C:/Users/thoma/Documents/films/The Equalizer (2014).mp4", //"./hls-testing/top5.mov"
    "./public/videos/otherrandomid",
    new RelativeMaster(),
    new Logger("transcode", "bgMagenta")
);
transcoder.transcode(
    [
        {
            name: "720p",
            width: 1280,
            rate: 3,
        },
        {
            name: "360p",
            width: 480,
            rate: 1,
            audio: 48,
        },
    ],
    "1080p"
);
