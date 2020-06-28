import {Request, Response, Router, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import passport from 'passport';

import {commentValidators} from '../../utils/validators';
import Article from '../../models/Article';
import Comment from '../../models/Comment';
const router = Router();

router.post(
	'/',
	passport.authenticate('isAuth', {session: false}),
	commentValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({success: false, message: errors.array()[0].msg});
			}

			let comment = await Comment.create(req.body);
			comment = await comment.populate('user').execPopulate();

			await Article.updateOne({_id: req.body.articleId}, {$push: {comments: comment._id}});

			res.json({success: true, comment});
		} catch (err) {
			next(err);
		}
	},
);

router.delete(
	'/:commentId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const comment = await Comment.findByIdAndRemove(req.params.commentId);

			if (comment) {
				await Promise.all([
					Comment.deleteMany({parentId: comment._id}),
					Article.updateOne({_id: comment.articleId}, {$pullAll: {comments: [comment._id]}}),
				]);
			}

			res.json({success: true, comment});
		} catch (err) {
			next(err);
		}
	},
);

router.post(
	'/replies',
	passport.authenticate('isAuth', {session: false}),
	commentValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({success: false, message: errors.array()[0].msg});
			}

			let reply = await Comment.create(req.body);
			reply = await reply.populate('user').execPopulate();

			await Comment.updateOne({_id: reply.parentId}, {$push: {replies: reply._id}});

			res.json({success: true, reply});
		} catch (err) {
			next(err);
		}
	},
);

router.delete(
	'/replies/:replyId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const reply = await Comment.findByIdAndRemove(req.params.replyId);

			if (reply) {
				await Comment.updateOne({_id: reply.parentId}, {$pullAll: {replies: [reply._id]}});
			}

			res.json({success: true, reply});
		} catch (err) {
			next(err);
		}
	},
);

router.get(
	'/like/:commentId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const success = await Comment.updateOne({_id: req.params.commentId}, {$inc: {likes: 1}});

			res.json({success});
		} catch (err) {
			next(err);
		}
	},
);

router.get(
	'/dislike/:commentId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const success = await Comment.updateOne({_id: req.params.commentId}, {$inc: {dislikes: 1}});

			res.json({success});
		} catch (err) {
			next(err);
		}
	},
);

export default router;
