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
import dotenv from 'dotenv';
import cors from 'cors';
import tinify from 'tinify';
import * as Sentry from '@sentry/node';

import {getLogger} from './utils/logger';
import router from './router';
import {makeSeeding} from './seeding';

dotenv.config();
const logger = getLogger(module);
const isProd = process.env.NODE_ENV === 'production';

// Sentry
Sentry.init({dsn: 'https://42a70964b139445a9f9f2e4e59993747@sentry.io/5167390'});

const app: Application = express();
const apiLimiter = new rateLimit({
	windowMs: 15 * 60 * 1000,
	max: isProd ? 100 : 1000
});

mongoose
	.connect(String(process.env.MONGO_URI), {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		autoIndex: !isProd
	})
	.then(async () => {
		logger.info('MongoDB');

		if (isProd) {
			await makeSeeding();
		}
	})
	.catch((err: Error) => logger.error(err.message));

tinify.key = String(process.env.TINIFY_API_KEY);

// middleware
app.use(
	Sentry.Handlers.requestHandler({
		serverName: false,
		user: ['email']
	})
);
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
app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/uploads'));

// router
app.use('/api', router);

app.use(Sentry.Handlers.errorHandler());

// 404
app.use((req, res) => {
	res.status(404).json({error: 'Sorry cant find that !'});
});

// 500
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	logger.error(err.message);
	res.status(500).json({error: {msg: 'Error. Try again'}});
});

export default app;
