import {Router} from 'express';
import passport from 'passport';

import {categoryValidators} from '../../middlewares/validators';
import CategoriesController from '../../controllers/categories.controller';

const router = Router();

router.post(
	'/',
	passport.authenticate('isAuth', {session: false}),
	categoryValidators,
	CategoriesController.createCategory,
);

router.get('/', CategoriesController.getCategories);

router.get('/:slug', CategoriesController.getCategory);

router.put(
	'/:categoryId',
	passport.authenticate('isAuth', {session: false}),
	categoryValidators,
	CategoriesController.updateCategory,
);

router.post(
	'/remove',
	passport.authenticate('isAuth', {session: false}),
	CategoriesController.deleteCategories,
);

router.get('/:categoryId/articles', CategoriesController.getCategoryArticles);

export default router;
