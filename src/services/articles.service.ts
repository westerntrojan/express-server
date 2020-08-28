import formidable from 'formidable';

import {removeArticle} from '../utils/articles';
import {getSlug} from '../utils/common';
import {uploadImage, removeImage} from '../utils/images';
import {Article, Comment, User} from '../models/';
import {IArticle} from '../models/Article';
import {IComment} from '../models/Comment';

class ArticlesService {
	async createArticle({data}: {data: IArticle}): Promise<{article: IArticle}> {
		let article = await Article.create(data);
		article = await article.populate('user category').execPopulate();

		return {article};
	}

	async getArticles({skip}: {skip: number}): Promise<{articles: IArticle[]}> {
		const articles = await Article.find()
			.sort({created: -1})
			.skip(skip)
			.limit(10)
			.populate('user category')
			.populate({
				path: 'comments',
				options: {
					sort: {created: -1},
					populate: {
						path: 'user replies',
						options: {
							sort: {created: 1},
							populate: {
								path: 'user',
							},
						},
					},
				},
			});

		return {articles};
	}

	async getArticle({
		slug,
	}: {
		slug: string;
	}): Promise<{success: true; article: IArticle} | {success: false}> {
		const article = await Article.findOne({slug})
			.sort({created: -1})
			.populate('user category')
			.populate({
				path: 'comments',
				options: {
					sort: {created: -1},
					populate: {
						path: 'user replies',
						options: {
							sort: {created: 1},
							populate: {
								path: 'user',
							},
						},
					},
				},
			});

		if (!article) {
			return {success: false};
		}

		return {success: true, article};
	}

	async updateArticle({
		articleId,
		fields,
		files,
	}: {
		articleId: string;
		fields: formidable.Fields;
		files: formidable.Files;
	}): Promise<{success: true; article: IArticle} | {success: false; message: string}> {
		let image = String(fields.image) || '';

		if (files.image) {
			const uploadResult = await uploadImage(files.image);

			if (!uploadResult.success) {
				return {success: false, message: uploadResult.message};
			}

			image = uploadResult.public_id;
		}

		const article = await Article.findById(articleId);

		if (!article) {
			return {success: false, message: 'Article not found'};
		}

		if (article.image && fields.image !== article.image) {
			await removeImage(article.image);
		}

		const newArticle = await Article.findByIdAndUpdate(
			articleId,
			{
				$set: {
					...fields,
					tags: fields.tags ? JSON.parse(JSON.stringify(fields.tags)) : article.tags,
					slug: fields.title ? getSlug(String(fields.title)) : article.slug,
					image,
				},
			},
			{new: true},
		)
			.populate('user category')
			.populate('comments', null, null, {
				sort: {created: -1},
				populate: {
					path: 'user',
				},
			});

		if (!newArticle) {
			return {success: false, message: 'Something went wrong. Try again'};
		}

		return {success: true, article: newArticle};
	}

	async deleteArticle({articleId}: {articleId: string}) {
		const article = await removeArticle(articleId);

		if (!article) {
			return {success: false};
		}

		if (article.image) {
			await removeImage(article.image);
		}

		return {success: true};
	}

	async addArticleView({articleId}: {articleId: string}): Promise<void> {
		await Article.updateOne({_id: articleId}, {$inc: {views: 1}});
	}

	async createComment({data}: {data: IComment}): Promise<{comment: IComment}> {
		let comment = await Comment.create(data);
		comment = await comment.populate('user').execPopulate();

		await Article.updateOne({_id: comment.articleId}, {$push: {comments: comment._id}});

		return {comment};
	}

	async deleteComment({
		commentId,
	}: {
		commentId: string;
	}): Promise<{success: true; comment: IComment} | {success: false; message: string}> {
		const comment = await Comment.findByIdAndRemove(commentId);

		if (!comment) {
			return {success: false, message: 'Comment not found'};
		}

		await Promise.all([
			Comment.deleteMany({parentId: comment._id}),
			Article.updateOne({_id: comment.articleId}, {$pullAll: {comments: [comment._id]}}),
		]);

		return {success: true, comment};
	}

	async createReply({data}: {data: IComment}): Promise<{reply: IComment}> {
		let reply = await Comment.create(data);
		reply = await data.populate('user').execPopulate();

		await Comment.updateOne({_id: reply.parentId}, {$push: {replies: reply._id}});

		return {reply};
	}

	async deleteReply({
		replyId,
	}: {
		replyId: string;
	}): Promise<{success: true; reply: IComment} | {success: false; message: string}> {
		const reply = await Comment.findByIdAndRemove(replyId);

		if (!reply) {
			return {success: false, message: 'Reply not found'};
		}

		await Comment.updateOne({_id: reply.parentId}, {$pullAll: {replies: [reply._id]}});

		return {success: true, reply};
	}

	async addCommentLike({commentId}: {commentId: string}): Promise<void> {
		await Comment.updateOne({_id: commentId}, {$inc: {likes: 1}});
	}

	async addCommentDislike({commentId}: {commentId: string}): Promise<void> {
		await Comment.updateOne({_id: commentId}, {$inc: {dislikes: 1}});
	}

	async getUserBookmarks({
		userId,
	}: {
		userId: string;
	}): Promise<{success: true; articles: IArticle[]} | {success: false; message: string}> {
		const user = await User.findById(userId);

		if (!user) {
			return {success: false, message: 'User not found'};
		}

		const articles: IArticle[] = [];

		await Promise.all(
			user.bookmarks.map(async (articleId: string) => {
				const article = await Article.findById(articleId).populate('user comments');

				if (article) {
					articles.push(article);
				}
			}),
		);

		return {success: true, articles};
	}

	async setBookmark({
		userId,
		articleId,
	}: {
		userId: string;
		articleId: string;
	}): Promise<{success: true; action: 'removed' | 'added'} | {success: false; message: string}> {
		const user = await User.findById(userId);

		if (!user) {
			return {success: false, message: 'User not found'};
		}

		if (user.bookmarks.includes(articleId)) {
			await Promise.all([
				Article.updateOne({_id: articleId}, {$inc: {bookmarksCount: -1}}),
				User.updateOne({_id: userId}, {$pullAll: {bookmarks: [articleId]}}),
			]);

			return {success: true, action: 'removed'};
		}

		await Promise.all([
			Article.updateOne({_id: articleId}, {$inc: {bookmarksCount: 1}}),
			User.updateOne({_id: userId}, {$push: {bookmarks: articleId}}),
		]);

		return {success: true, action: 'added'};
	}

	async getArticlesByTag({tag, skip}: {tag: string; skip: number}) {
		const articles = await Article.find({tags: tag})
			.sort({created: -1})
			.skip(skip)
			.limit(10)
			.populate('user')
			.populate({
				path: 'comments',
				options: {
					populate: {
						path: 'replies',
					},
				},
			});

		return {articles};
	}
}

export default new ArticlesService();
