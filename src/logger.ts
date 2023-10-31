const colors = {
	reset: "\x1b[0m",

	fgBlack: "\x1b[30m",
	fgRed: "\x1b[31m",
	fgGreen: "\x1b[32m",
	fgYellow: "\x1b[33m",
	fgBlue: "\x1b[34m",
	fgMagenta: "\x1b[35m",
	fgCyan: "\x1b[36m",
	fgWhite: "\x1b[37m",
	fgGray: "\x1b[90m",

	bgBlack: "\x1b[40m",
	bgRed: "\x1b[41m",
	bgGreen: "\x1b[42m",
	bgYellow: "\x1b[43m",
	bgBlue: "\x1b[44m",
	bgMagenta: "\x1b[45m",
	bgCyan: "\x1b[46m",
	bgWhite: "\x1b[47m",
	bgGray: "\x1b[100m",
};

export class Logger {
	private name;
	private color;
	private disabled;

	constructor(
		name: string,
		color: keyof typeof colors,
		disabled: boolean = false
	) {
		this.name = name;
		this.color = color;
		this.disabled = disabled;
	}

	info(...message: any[]) {
		if (this.disabled) return;
		console.info(...this.messageBuilder("info", message, colors.bgBlue));
		return this;
	}
	error(...message: any[]) {
		if (this.disabled) return;
		console.error(...this.messageBuilder("error", message, colors.bgRed));
		return this;
	}
	warn(...message: any[]) {
		if (this.disabled) return;
		console.warn(
			...this.messageBuilder("warn", message, colors.bgYellow, true)
		);
		return this;
	}

	private messageBuilder(
		prefix: string,
		message: any[],
		prefixColor: string,
		prefixDark: boolean = false
	) {
		return [
			colors[this.color] + colors.fgBlack,
			this.name.toUpperCase(),
			colors.reset,
			prefixColor + (prefixDark ? "\x1b[30m" : "\x1b[37m"),
			prefix.toUpperCase(),
			colors.reset,
			...message,
		];
	}
}
