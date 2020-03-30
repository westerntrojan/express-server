import {Router} from 'express';

import articlesRouter from './articles';
import authRouter from './auth';
import usersRouter from './users';
import chatsRouter from './chats';
import categoryRouter from './category';
import dataRouter from './data';

const router = Router();

router.use('/articles', articlesRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/chats', chatsRouter);
router.use('/category', categoryRouter);
router.use('/data', dataRouter);

if (process.env.NODE_ENV !== 'production') {
	const testRouter = require('./test');

	router.use('/test', testRouter);
}

export default router;
