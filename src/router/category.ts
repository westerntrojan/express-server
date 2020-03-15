import {Request, Response, Router, NextFunction} from 'express';
import slugify from 'slugify';

import Article from '../models/Article';
import Category from '../models/Category';
import {categoryValidators} from '../utils/validators';
import {removeArticle} from '../utils/articles';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const category = await Category.find();

		res.json({category});
	} catch (err) {
		next(err);
	}
});

router.post('/', categoryValidators, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const slug = slugify(req.body.title, {
			lower: true,
			replacement: '-'
		});

		const slugValidate = await Category.findOne({slug});

		if (slugValidate) {
			return res.json({errors: [{msg: 'This category exists.'}]});
		}

		const category = await Category.create(req.body);

		res.json({category});
	} catch (err) {
		next(err);
	}
});

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
	categoryValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const slug = slugify(req.body.title, {
				lower: true,
				replacement: '-'
			});

			const slugValidate = await Category.findOne({slug});

			if (slugValidate) {
				return res.json({errors: [{msg: 'This category exists.'}]});
			}

			const category = await Category.findByIdAndUpdate(
				req.params.categoryId,
				{$set: {...req.body, slug}},
				{new: true}
			);

			res.json({category});
		} catch (err) {
			next(err);
		}
	}
);

router.delete('/:categoryId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Category.deleteOne({_id: req.params.categoryId});

		const articles = await Article.find({category: req.params.categoryId});

		await Promise.all(
			articles.map(async article => {
				await removeArticle(article._id);
			})
		);

		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

export default router;
