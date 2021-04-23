import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';

import {getNotFoundError} from '../utils/errors';
import CategoriesService from '../services/categories.service';

class CategoriesController {
	async createCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({success: false, message: errors.array()[0].msg});
			}

			const result = await CategoriesService.createCategory({data: req.body});

			if (!result.success) {
				return res.json({errors: [{msg: result.message}]});
			}

			res.json({success: true, category: result.category});
		} catch (err) {
			next(err);
		}
	}

	async getCategories(req: Request, res: Response, next: NextFunction) {
		try {
			const categories = await CategoriesService.getCategories();

			res.json({categories});
		} catch (err) {
			next(err);
		}
	}

	async getCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await CategoriesService.getCategory({slug: req.params.slug});

			if (!result.success) {
				const notFoundError = getNotFoundError();

				return res.status(404).json(notFoundError);
			}

			res.json({success: true, category: result.category});
		} catch (err) {
			next(err);
		}
	}

	async updateCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({success: false, message: errors.array()[0].msg});
			}

			const result = await CategoriesService.updateCategory({
				categoryId: req.params.categoryId,
				data: req.body,
			});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true, category: result.category});
		} catch (err) {
			next(err);
		}
	}

	async removeCategories(req: Request, res: Response, next: NextFunction) {
		try {
			const {categoryId} = await CategoriesService.removeCategories({
				categoryId: req.params.categoryId,
			});

			res.json({success: true, categoryId});
		} catch (err) {
			next(err);
		}
	}

	async getCategoryArticles(req: Request, res: Response, next: NextFunction) {
		try {
			const articles = await CategoriesService.getCategoryArticles({
				categoryId: req.params.categoryId,
				skip: Number(req.query.skip),
			});

			res.json({articles});
		} catch (err) {
			next(err);
		}
	}
}

export default new CategoriesController();
