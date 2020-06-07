import {Router} from 'express';

import articles from './articles';
import auth from './auth';
import users from './users';
import chats from './chats';
import categories from './categories';
import data from './data';
import app from './app';

const router = Router();

router.use('/articles', articles);
router.use('/auth', auth);
router.use('/users', users);
router.use('/chats', chats);
router.use('/categories', categories);
router.use('/data', data);
router.use('/app', app);

export default router;
