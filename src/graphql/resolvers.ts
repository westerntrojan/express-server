import {
	GraphQLDateTime,
	GraphQLEmail,
	GraphQLURL,
	GraphQLLimitedString,
	GraphQLPassword,
} from 'graphql-custom-types';

import Article from '../models/Article';

interface AddArticle {
	title: string;
	text: string;
	image?: string;
}

interface EditArticle {
	articleId: string;
	title?: string;
	text?: string;
	image?: string;
	views?: number;
}

export default {
	DateTime: GraphQLDateTime,
	Email: GraphQLEmail,
	URL: GraphQLURL,
	LimitString: new GraphQLLimitedString(2, 12),
	Password: new GraphQLPassword(6, 20),

	Query: {
		totalArticles: async () => await Article.countDocuments(),
		articles: async (_: any, args: {first: number}) => await Article.find().limit(args.first),
		article: async (_: any, args: {articleId: string}) => await Article.findById(args.articleId),
	},

	Mutation: {
		addArticle: async (_: any, args: {input: AddArticle}) => {
			return await Article.create(args.input);
		},
		editArticle: async (_: any, args: {input: EditArticle}) => {
			return await Article.findOneAndUpdate(
				{_id: args.input.articleId},
				{$set: args.input},
				{new: true}
			);
		},
		removeArticle: async (_: any, args: {articleId: string}) => {
			return await Article.findOneAndRemove({_id: args.articleId});
		},
	},
};
