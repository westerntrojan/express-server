import {Article, User} from '../../models';
import {IArticle} from '../../models/Article';

export default {
	allArticles: async () => Article.find().populate('user comments'),
	allUsers: async () => User.find(),
	Article: async (_: object, args: {id: string}) =>
		Article.findById(args.id).populate('user comments'),

	topTags: () => [
		'development',
		'news',
		'events',
		'article',
		'random',
		'text',
		'lorem ipsum',
		'other',
		'asd',
		'some tag',
		'people',
		'beautiful',
		'forest',
	],
	topArticles: async (_: object, args: {limit: number}) => {
		const articles = await Article.find()
			.limit(args.limit)
			.populate('user comments');

		return articles;
	},

	articleStatistics: async () => {
		const articles = await Article.find()
			.sort({views: -1})
			.limit(10);

		const data = {
			labels: articles.map(article => {
				if (article.title.length > 10) {
					return `${article.title.slice(0, 10)}...`;
				}

				return article.title;
			}),
			views: articles.map(article => article.views),
			comments: articles.map(article => article.comments.length),
		};

		return data;
	},
	userBookmarks: async (_: object, args: {userId: string}) => {
		const user = await User.findById(args.userId);

		if (!user) {
			throw new Error('User not found');
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

		return articles;
	},
};
