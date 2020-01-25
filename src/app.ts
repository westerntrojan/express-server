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
import cloudinary from 'cloudinary';

import getLogger from './utils/logger';
import router from './router';

dotenv.config();
const logger = getLogger(module);
const isProd = process.env.NODE_ENV === 'production';

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

cloudinary.v2.config({
	cloud_name: 'di1kptduj',
	api_key: '372185752442274',
	api_secret: '2bb3vGm7e8ilkhrWpC41ekqhGZ8',
});

// middleware
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

// router;
app.use('/api', router);

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
