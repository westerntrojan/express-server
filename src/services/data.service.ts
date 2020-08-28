import Article, {IArticle} from '../models/Article';

interface IArticleStatistics {
	labels: string[];
	views: number[];
	comments: number[];
}

class DataService {
	async getArticleStatistics(): Promise<IArticleStatistics> {
		const articles = await Article.find()
			.sort({views: -1})
			.limit(10)
			.populate('comments')
			.populate('category');

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
	}
}

export default new DataService();
