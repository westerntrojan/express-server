import {createLogger, format, transports} from 'winston';

interface Module {
	filename: string;
}

const myFormat = format.printf(({level, message, label, timestamp}) => {
	return `${timestamp} [${label}] ${level}: ${message}`;
});

export default (module: Module) => {
	const filename = module.filename
		.split(process.platform === 'win32' ? '\\' : '/')
		.slice(-2)
		.join('/');

	const logger = createLogger({
		level: 'info',
		format: format.combine(
			format.label({
				label: filename,
			}),
			format.timestamp({
				format: 'YYYY-MM-DD HH:mm:ss',
			}),
			format.errors({stack: true}),
			format.splat(),
			format.json(),
			myFormat,
		),
		transports: [
			//
			// - Write to all logs with level `info` and below to `combined.log`
			// - Write all logs error (and below) to `error.log`.
			//
			new transports.File({filename: 'logs/error.log', level: 'error'}),
			new transports.File({filename: 'logs/combined.log'}),
		],
	});

	//
	// If we're not in production then log to the `console` with the format:
	// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
	//
	if (process.env.NODE_ENV !== 'production') {
		logger.add(
			new transports.Console({
				format: format.combine(format.colorize(), format.simple()),
			}),
		);
	}

	return logger;
};
