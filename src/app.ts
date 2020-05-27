import express, {Application, Request, Response, NextFunction} from 'express';
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import helmet from 'helmet';
import hpp from 'hpp';
import responseTime from 'response-time';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import tinify from 'tinify';
import moment from 'moment';
import passport from 'passport';
import config from 'config';
// import * as Sentry from '@sentry/node';

import {getLogger} from './utils/logger';
import {getNotFoundError} from './utils/errors';
import apiRouter from './api';
import {login, isAuth, registerVerify, passwordResetVerify} from './utils/passport-strategies';
import {makeSeeding} from './seeding';

const logger = getLogger(module);
const isProd = process.env.NODE_ENV === 'production';

// Sentry
// Sentry.init({dsn: 'https://42a70964b139445a9f9f2e4e59993747@sentry.io/5167390'});

const app: Application = express();
const apiLimiter = new rateLimit({
	windowMs: 15 * 60 * 1000,
	max: isProd ? 100 : 1000,
});

mongoose
	.connect(config.get('mongo_uri'), {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		autoIndex: !isProd,
	})
	.then(() => {
		logger.info('MongoDB');

		if (isProd) {
			return makeSeeding();
		}
	})
	.catch((err: Error) => logger.error(err.message));

tinify.key = config.get('tinify_api_key');

// middleware
// app.use(
// 	Sentry.Handlers.requestHandler({
// 		serverName: false,
// 		user: ['email'],
// 	}),
// );
if (isProd) {
	app.use(morgan('combined'));
} else {
	app.use(morgan('dev'));
}
app.use(cors());
app.use(errorHandler());
app.use(helmet());
app.use(hpp());
app.use(responseTime());
app.use('/api/', apiLimiter);
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/uploads'));

// passport strategies
passport.use('login', login);
passport.use('isAuth', isAuth);
passport.use('registerVerify', registerVerify);
passport.use('passwordResetVerify', passwordResetVerify);

// api
app.use('/api/v1', apiRouter);

// app.use(Sentry.Handlers.errorHandler());

// 404
app.use((req, res) => {
	const notFoundError = getNotFoundError();

	res.status(404).json(notFoundError);
});

// 500
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	logger.error(err.message);

	res.status(500).json({
		timestamp: moment().format(),
		status: 500,
		error: 'Internal Server Error',
	});
});

// error handlers
process.on('uncaughtException', err => {
	logger.error('Uncaught exception', err);

	throw err;
});

process.on('unhandledRejection', err => {
	logger.error('unhandled rejection', err);
});

export default app;
