interface Logger {
	error: (str: string) => void;
	warn: (str: string) => void;
	info: (str: string) => void;
	verbose: (str: string) => void;
	debug: (str: string) => void;
	silly: (str: string) => void;
}

declare const logger: Logger;

declare namespace NodeJS {
	interface Global {
		logger: Logger;
	}
}
