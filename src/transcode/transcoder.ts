import { Logger } from "@/logger";
import ffmpeg from "fluent-ffmpeg";

export interface TranscoderPostProcessor {
    postProcess(inputFile: string, outputPath: string): Promise<void>;
}

export class Transcoder {
    private inputFile;
    private outputPath;
    private postProcessor;
    private logger;

    constructor(
        inputFile: string,
        outputPath: string,
        postProcessor?: TranscoderPostProcessor,
        logger?: Logger
    ) {
        this.inputFile = inputFile;
        this.outputPath = outputPath;
        this.postProcessor = postProcessor;
        this.logger = logger;
    }

    transcode(
        qualities: {
            width: number;
            rate?: number;
            audio?: number;
            name: string;
        }[],
        originalQualityName: string = "1080p",
        originalRate: number = 5,
        originalAudio: number = 96,
        progress?: (percentage: number) => void
    ) {
        const mappedQualities = qualities.map((x, i) => ({
            index: i + 1,
            width: x.width,
            rate: x.rate ?? 5,
            audio: x.audio ?? 96,
            name: x.name,
        }));

        return new Promise<void>((res) => {
            ffmpeg(this.inputFile)
                // .on("start", function (commandLine) {
                // 	console.log("Spawned Ffmpeg with command: " + commandLine);
                // })
                // .on("error", function (error) {
                // 	console.log(error);
                // })
                // .on("stderr", function (stderrLine) {
                // 	console.log("Stderr output: " + stderrLine);
                // })
                .complexFilter([
                    {
                        filter: "split",
                        options: mappedQualities.length + 1,
                        inputs: "0:v",
                        outputs: [
                            "v0",
                            ...mappedQualities.map((x) => `v${x.index}`),
                        ],
                    },
                    {
                        filter: "copy",
                        inputs: "v0",
                        outputs: `[${originalQualityName}]`,
                    },
                    ...mappedQualities.map((x) => ({
                        filter: "scale",
                        options: `${x.width}:-2`,
                        inputs: `v${x.index}`,
                        outputs: `[${x.name}]`,
                    })),
                ])
                .outputOptions([
                    // original
                    `-map [${originalQualityName}]`,
                    "-c:v:0 h264_nvenc",
                    '-x264-params "nal-hrd=cbr:force-cfr=1"',
                    "-preset slow",
                    "-g 48",
                    "-sc_threshold 0",
                    "-keyint_min 48",

                    `-b:v:0 ${originalRate}M`,
                    `-maxrate:v:0 ${originalRate}M`,
                    `-minrate:v:0 ${originalRate}M`,
                    `-bufsize:v:0 ${
                        originalRate * (originalRate > 4 ? 2 : 1)
                    }M`,

                    ...mappedQualities.flatMap((x) => [
                        `-map [${x.name}]`,
                        `-c:v:${x.index} h264_nvenc`,
                        '-x264-params "nal-hrd=cbr:force-cfr=1"',
                        "-preset slow",
                        "-g 48",
                        "-sc_threshold 0",
                        "-keyint_min 48",

                        `-b:v:${x.index} ${x.rate}M`,
                        `-maxrate:v:${x.index} ${x.rate}M`,
                        `-minrate:v:${x.index} ${x.rate}M`,
                        `-bufsize:v:${x.index} ${
                            x.rate * (x.rate > 4 ? 2 : 1)
                        }M`,
                    ]),

                    // Map audio
                    "-map a:0",
                    "-c:a:0 aac",
                    `-b:a:0 ${originalAudio}k`,
                    "-ac 2",
                    ...mappedQualities.flatMap((x, i) => [
                        "-map a:0",
                        `-c:a:${x.index} aac`,
                        `-b:a:${x.index} ${x.audio}k`,
                        "-ac 2",
                    ]),

                    // HLS settings
                    "-f hls",
                    "-hls_time 2",
                    "-hls_playlist_type vod",
                    "-hls_flags independent_segments",
                    "-hls_segment_type mpegts",
                    `-hls_segment_filename ${this.outputPath}/segments_%v/data%02d.ts`,
                ])
                .outputOption(
                    "-master_pl_name",
                    `master.m3u8`,
                    "-var_stream_map",
                    `v:0,a:0,name:${originalQualityName} ${mappedQualities
                        .map((x) => `v:${x.index},a:${x.index},name:${x.name}`)
                        .join(" ")}`
                )
                .output(`${this.outputPath}/segments_%v/manifest.m3u8`)
                .on("progress", (status: { percent: number }) => {
                    const percentage = Math.min(status.percent / 100, 0.99);

                    if (progress) progress(percentage);
                    this.logger?.info(
                        "progress",
                        (percentage * 100).toFixed(2) + "%",
                        "done"
                    );
                })
                .on("end", async () => {
                    if (progress) progress(1);
                    this.logger?.info("finished transcode");

                    if (this.postProcessor) {
                        this.logger?.info("starting post processing");
                        await this.postProcessor.postProcess(
                            this.inputFile,
                            this.outputPath
                        );
                        this.logger?.info("finished post processing");
                    }

                    res();
                })
                .run();
        });
    }
}
