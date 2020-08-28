import {Router} from 'express';

import articlesRoutes from './articles.routes';
import categoriesRoutes from './categories.routes';
import dataRoutes from './data.routes';
import appRoutes from './app.routes';
import authRoutes from './auth.routes';
import chatsRoutes from './chats.routes';
import usersRoutes from './users.routes';
import searchRoutes from './search.routes';
import cloudRoutes from './cloud.routes';

const router = Router();

router.use('/articles', articlesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/data', dataRoutes);
router.use('/app', appRoutes);
router.use('/auth', authRoutes);
router.use('/chats', chatsRoutes);
router.use('/users', usersRoutes);
router.use('/search', searchRoutes);
router.use('/cloud', cloudRoutes);

export default router;
