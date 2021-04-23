import {Router} from 'express';
import passport from 'passport';

import ArticlesController from '../../controllers/articles.controller';
import {articleValidators, commentValidators} from '../../middlewares/validators';

const router = Router();

router.post(
	'/',
	passport.authenticate('isAuth', {session: false}),
	articleValidators,
	ArticlesController.createArticle,
);

router.get('/', ArticlesController.getArticles);

router.get('/:slug', ArticlesController.getArticle);

router.put(
	'/:articleId',
	passport.authenticate('isAuth', {session: false}),
	articleValidators,
	ArticlesController.updateArticle,
);

router.delete(
	'/:articleId',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.removeArticle,
);

router.get('/views/:articleId', ArticlesController.addArticleView);

router.post(
	'/comments',
	passport.authenticate('isAuth', {session: false}),
	commentValidators,
	ArticlesController.createComment,
);

router.delete(
	'/comments/:commentId',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.removeComment,
);

router.post(
	'/comments/replies',
	passport.authenticate('isAuth', {session: false}),
	commentValidators,
	ArticlesController.createReply,
);

router.delete(
	'/comments/replies/:replyId',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.removeReply,
);

router.get(
	'/comments/like/:commentId',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.addCommentLike,
);

router.get(
	'/comments/dislike/:commentId',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.addCommentDislike,
);

router.get('/tag/:tag', ArticlesController.getArticlesByTag);

export default router;
