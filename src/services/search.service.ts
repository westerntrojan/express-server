import {Article, User} from '../models';
import {IArticle} from '../models/Article';
import {IUser} from '../models/User';

class SearchService {
	async search({
		searchQuery,
	}: {
		searchQuery: string;
	}): Promise<{articles: IArticle[]; users: IUser[]}> {
		const articles = await Article.find({
			$or: [{title: {$regex: searchQuery, $options: 'i'}}],
		}).limit(5);

		const users = await User.find({
			$or: [
				{firstName: {$regex: searchQuery, $options: 'i'}},
				{lastName: {$regex: searchQuery, $options: 'i'}},
				{username: {$regex: searchQuery, $options: 'i'}},
			],
		}).limit(5);

		return {articles, users};
	}
}

export default new SearchService();
