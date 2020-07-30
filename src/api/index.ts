import {Router} from 'express';

import articlesRouter from './articles';
import authRouter from './auth';
import usersRouter from './users';
import chatsRouter from './chats';
import categoriesRouter from './categories';
import dataRouter from './data';
import appRouter from './app';
import searchRouter from './search';
import cloudRouter from './cloud';
import testRouter from './test';

const router = Router();

router.use('/articles', articlesRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/chats', chatsRouter);
router.use('/categories', categoriesRouter);
router.use('/data', dataRouter);
router.use('/app', appRouter);
router.use('/search', searchRouter);
router.use('/cloud', cloudRouter);
router.use('/test', testRouter);

export default router;
