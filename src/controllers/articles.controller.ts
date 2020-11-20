import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';

import {getNotFoundError} from '../utils/errors';
import ArticlesService from '../services/articles.service';

class ArticlesController {
	async createArticle(req: Request, res: Response, next: NextFunction) {
		try {
			const {article} = await ArticlesService.createArticle({data: req.body});

			res.json({success: true, article});
		} catch (err) {
			next(err);
		}
	}

	async getArticles(req: Request, res: Response, next: NextFunction) {
		try {
			const {articles} = await ArticlesService.getArticles({skip: Number(req.query.skip) || 0});

			res.json({articles});
		} catch (err) {
			next(err);
		}
	}

	async getArticle(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await ArticlesService.getArticle({slug: req.params.slug});

			if (!result.success) {
				const notFoundError = getNotFoundError();

				return res.status(404).json(notFoundError);
			}

			res.json({success: true, article: result.article});
		} catch (err) {
			next(err);
		}
	}

	async updateArticle(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await ArticlesService.updateArticle({data: req.body});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			return res.json({success: true, article: result.article});
		} catch (err) {
			next(err);
		}
	}

	async deleteArticle(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await ArticlesService.deleteArticle({articleId: req.params.articleId});

			if (!result.success) {
				const notFoundError = getNotFoundError();

				return res.status(404).json(notFoundError);
			}

			return res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async addArticleView(req: Request, res: Response, next: NextFunction) {
		try {
			await ArticlesService.addArticleView({articleId: req.params.articleId});

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async createComment(req: Request, res: Response, next: NextFunction) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({success: false, message: errors.array()[0].msg});
			}

			const {comment} = await ArticlesService.createComment({data: req.body});

			res.json({success: true, comment});
		} catch (err) {
			next(err);
		}
	}

	async deleteComment(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await ArticlesService.deleteComment({commentId: req.params.commentId});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true, comment: result.comment});
		} catch (err) {
			next(err);
		}
	}

	async createReply(req: Request, res: Response, next: NextFunction) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({success: false, message: errors.array()[0].msg});
			}

			const {reply} = await ArticlesService.createReply({data: req.body});

			res.json({success: true, reply});
		} catch (err) {
			next(err);
		}
	}

	async deleteReply(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await ArticlesService.deleteReply({replyId: req.params.replyId});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true, reply: result.reply});
		} catch (err) {
			next(err);
		}
	}

	async addCommentLike(req: Request, res: Response, next: NextFunction) {
		try {
			await ArticlesService.addCommentLike({commentId: req.params.commentId});

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async addCommentDislike(req: Request, res: Response, next: NextFunction) {
		try {
			await ArticlesService.addCommentDislike({commentId: req.params.commentId});

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async getUserBookmarks(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await ArticlesService.getUserBookmarks({userId: req.params.userId});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			return res.json({success: true, articles: result.articles});
		} catch (err) {
			next(err);
		}
	}

	async setBookmark(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await ArticlesService.setBookmark({
				userId: req.params.userId,
				articleId: req.params.articleId,
			});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			return res.json({success: true, [result.action]: true});
		} catch (err) {
			next(err);
		}
	}

	async getArticlesByTag(req: Request, res: Response, next: NextFunction) {
		try {
			const {articles} = await ArticlesService.getArticlesByTag({
				tag: req.params.tag,
				skip: Number(req.query.skip) || 0,
			});

			res.json({articles});
		} catch (err) {
			next(err);
		}
	}
}

export default new ArticlesController();
