import express, {Application, Request, Response} from 'express';

const morgan = require('morgan');
const errorHandler = require('errorhandler');
const helmet = require('helmet');
const hpp = require('hpp');
const responseTime = require('response-time');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const consola = require('consola');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressPlayground = require('graphql-playground-middleware-express').default;
require('dotenv').config();

const router = require('./router');

const app: Application = express();
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
});

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => consola.success('MongoDB'))
	.catch((err: object) => consola.error(err));

// middleware
if (process.env.NODE_ENV === 'production') {
	app.use(morgan('combined'));
} else {
	app.use(morgan('dev'));
}
app.use(errorHandler());
app.use(helmet());
app.use(hpp());
app.use(responseTime());
app.use('/api/', apiLimiter);
app.use('/api/', cors());
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// /playground, /graphql
app.use('/playground', expressPlayground({endpoint: '/graphql'}));

// router
app.use('/api', router);

// 404
// app.use((req, res) => {
// 	res.status(404).send('Sorry cant find that!');
// });

module.exports = app;
