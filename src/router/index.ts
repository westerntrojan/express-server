import {Router} from 'express';

import articlesRouter from './articles';
import authRouter from './auth';
import usersRouter from './users';

const router = Router();

router.use('/articles', articlesRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);

export default router;
