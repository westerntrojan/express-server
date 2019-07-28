const {
	GraphQLDateTime,
	GraphQLEmail,
	GraphQLURL,
	GraphQLLimitedString,
	GraphQLPassword,
} = require('graphql-custom-types');

const Article = require('../models/Article');
const Comment = require('../models/Comment');

module.exports = {
	DateTime: GraphQLDateTime,
	Email: GraphQLEmail,
	URL: GraphQLURL,
	LimitString: new GraphQLLimitedString(2, 12),
	Password: new GraphQLPassword(6, 20),

	Article: {
		comments: async parent => await Comment.find({articleId: parent._id}),
	},

	Query: {
		totalArticles: async () => await Article.find().count(),
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
			const article = await Article.findOneAndRemove({_id: articleId});
			await Comment.deleteMany({articleId});

			return article;
		},
		addComment: async (_, {input}, {pubsub}) => {
			const comment = await Comment.create(input);

			pubsub.publish('new-comment', {newComment: comment});

			return comment;
		},
	},

	Subscription: {
		newComment: {
			subscribe: (_, __, {pubsub}) => pubsub.asyncIterator('new-comment'),
		},
	},
};
