import ffmpeg from "fluent-ffmpeg";

export async function getQualities(filePath: string) {
    const bestStream = await new Promise<
        | (ffmpeg.FfprobeData["streams"][0] & {
              width: number;
              height: number;
          })
        | undefined
    >((resolve) => {
        ffmpeg.ffprobe(filePath, (err, data) => {
            resolve(
                (
                    data.streams.filter(
                        (x) =>
                            x.codec_type === "video" &&
                            typeof x.width !== "undefined" &&
                            typeof x.height !== "undefined"
                    ) as ((typeof data)["streams"][0] & {
                        width: number;
                        height: number;
                    })[]
                ).sort((a, b) => b.width - a.width)[0]
            );
        });
    });

    let qualities = [
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
    ];

    let originalName = "1080p";
    if (bestStream) {
        qualities = qualities.filter((x) => x.width < bestStream.width);
        if (bestStream.width <= 1280 && bestStream.width > 480) {
            originalName = "720p";
        } else if (bestStream.width <= 480) {
            originalName = "360p";
        }
    }

    return { qualities, originalName };
}
