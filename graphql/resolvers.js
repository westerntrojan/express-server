const {
	GraphQLDateTime,
	GraphQLEmail,
	GraphQLURL,
	GraphQLLimitedString,
	GraphQLPassword,
} = require('graphql-custom-types');

const Article = require('../models/Article');

module.exports = {
	DateTime: GraphQLDateTime,
	Email: GraphQLEmail,
	URL: GraphQLURL,
	LimitString: new GraphQLLimitedString(2, 12),
	Password: new GraphQLPassword(6, 20),

	Query: {
		totalArticles: async () => await Article.countDocuments(),
		articles: async (_, {first}) => await Article.find().limit(first),
		article: async (_, {articleId}) => await Article.findById(articleId),
	},

	Mutation: {
		addArticle: async (_, {input}) => {
			return await Article.create(input);
		},
		editArticle: async (_, {input}) => {
			return await Article.findOneAndUpdate({_id: input.articleId}, {$set: input}, {new: true});
		},
		removeArticle: async (_, {articleId}) => {
			return await Article.findOneAndRemove({_id: articleId});
		},
	},
};
