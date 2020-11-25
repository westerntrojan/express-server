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
import moment from 'moment';
import passport from 'passport';
import cloudinary from 'cloudinary';

import {getLogger} from './utils/logger';
import {getNotFoundError} from './utils/errors';
import routes from './routes/v1';
import {
	login,
	isAuth,
	isAdmin,
	registerVerify,
	passwordResetVerify,
} from './utils/passport-strategies';
import {apolloServer} from './apolloServer';

const logger = getLogger(module);

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app: Application = express();
const apiLimiter = new rateLimit({
	windowMs: 15 * 60 * 1000,
	max: isProd ? 100 : 1000,
});

mongoose
	.connect(String(process.env.MONGO_URI), {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		autoIndex: !isProd,
	})
	.then(() => logger.info('MongoDB'))
	.catch((err: Error) => logger.error(err.message));

// middleware
if (isProd) {
	app.use(morgan('combined'));
} else if (isDev) {
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
app.use(express.static(__dirname + '/../public'));

// apollo server
apolloServer.applyMiddleware({app});

// passport strategies
passport.use('login', login);
passport.use('isAuth', isAuth);
passport.use('isAdmin', isAdmin);
passport.use('registerVerify', registerVerify);
passport.use('passwordResetVerify', passwordResetVerify);

// api routes
app.use('/api/v1', routes);

// 404
app.use((req, res) => {
	const notFoundError = getNotFoundError();

	res.status(404).json(notFoundError);
});

// 500
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	logger.error(err);

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
