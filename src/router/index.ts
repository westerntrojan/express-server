import {Router} from 'express';

import articlesRouter from './articles';
import authRouter from './auth';
import usersRouter from './users';
import chatRouter from './chat';
import testRouter from './test';

const router = Router();

router.use('/articles', articlesRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/chat', chatRouter);
router.use('/test', testRouter);

export default router;
