import path from "path";
import { TranscoderPostProcessor } from "./transcoder";
import { readFile, writeFile } from "fs/promises";

export class RelativeMaster implements TranscoderPostProcessor {
	async postProcess(inputFile: string, outputPath: string) {
		const masterPath = path.join(outputPath, "master.m3u8");
		const master = await readFile(masterPath, "utf-8");
		const lines = master.split("\n");

		const newLines = [];
		for (const line of lines) {
			if (!line.startsWith("/")) newLines.push(line);
			else newLines.push(line.substring(1));
		}

		const newMaster = newLines.join("\n");
		await writeFile(masterPath, newMaster, "utf-8");
	}
}
