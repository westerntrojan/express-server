import {Request, Response, Router, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import passport from 'passport';

import Article from '../models/Article';
import Category from '../models/Category';
import {categoryValidators} from '../utils/validators';
import {removeArticle} from '../utils/articles';
import {getSlug} from '../utils/app';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const category = await Category.find();

		res.json({category});
	} catch (err) {
		next(err);
	}
});

router.post(
	'/',
	passport.authenticate('isAuth', {session: false}),
	categoryValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({errors: errors.array()});
			}

			const slug = getSlug(req.body.title);

			const slugValidate = await Category.findOne({slug});

			if (slugValidate) {
				return res.json({errors: [{msg: 'This category exists.'}]});
			}

			const category = await Category.create(req.body);

			res.json({category});
		} catch (err) {
			next(err);
		}
	},
);

router.get('/:categoryId/articles', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const articles = await Article.find({category: req.params.categoryId})
			.sort({created: -1})
			.skip(Number(req.query.skip))
			.limit(10)
			.populate('user');

		res.json({articles});
	} catch (err) {
		next(err);
	}
});

router.put(
	'/:categoryId',
	passport.authenticate('isAuth', {session: false}),
	categoryValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({errors: errors.array()});
			}

			const slug = getSlug(req.body.title);

			const slugValidate = await Category.findOne({slug});

			if (slugValidate) {
				return res.json({errors: [{msg: 'This category exists.'}]});
			}

			const category = await Category.findByIdAndUpdate(
				req.params.categoryId,
				{$set: {...req.body, slug}},
				{new: true},
			);

			res.json({category});
		} catch (err) {
			next(err);
		}
	},
);

router.post(
	'/remove',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const categories = req.body.categories;

			await Promise.all(
				categories.map(async (categoryId: string) => {
					await Category.deleteOne({_id: categoryId});

					const articles = await Article.find({category: categoryId});

					await Promise.all(articles.map(async article => removeArticle(article._id)));
				}),
			);

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	},
);

export default router;
