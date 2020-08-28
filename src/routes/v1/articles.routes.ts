import {Router} from 'express';
import passport from 'passport';

import ArticlesController from '../../controllers/articles.controller';

const router = Router();

router.post(
	'/',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.createArticle,
);

router.get('/', ArticlesController.getArticles);

router.get('/:slug', ArticlesController.getArticle);

router.put(
	'/:articleId',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.updateArticle,
);

router.delete(
	'/:articleId',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.deleteArticle,
);

router.get('/views/:articleId', ArticlesController.addArticleView);

router.post(
	'/comments',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.createComment,
);

router.delete(
	'/comments/:commentId',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.deleteComment,
);

router.post(
	'/comments/replies',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.createReply,
);

router.delete(
	'/comments/replies/:replyId',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.deleteReply,
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

router.get(
	'/bookmarks/:articleId/:userId',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.setBookmark,
);

router.get(
	'/bookmarks/:userId',
	passport.authenticate('isAuth', {session: false}),
	ArticlesController.getUserBookmarks,
);

router.get('/tag/:tag', ArticlesController.getArticlesByTag);

export default router;
