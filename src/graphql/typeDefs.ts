import {gql} from 'apollo-server-express';

export default gql`
	scalar DateTime
	scalar Email
	scalar URL
	scalar LimitString
	scalar Password
	scalar UUID

	type File {
		filename: String!
		mimetype: String!
		encoding: String!
	}

	type User {
		_id: ID!
		username: String!
		email: String!
		password: String!
		articles: Int!
		comments: Int!
		role: Int!
		isRemoved: Boolean!
		created: DateTime!
	}

	type Article {
		_id: ID!
		title: String!
		text: String!
		image: String
		views: Int!
		user: User!
		comments: [Comment!]
		created: DateTime!
	}

	type Comment {
		_id: ID!
		articleId: ID!
		text: String!
		user: User!
		created: DateTime!
	}

	input AddArticleInput {
		title: String!
		text: String!
		image: String
	}

	input EditArticleInput {
		articleId: ID!
		title: String!
		text: String!
		image: String
		views: Int
	}

	input AddComment {
		articleId: String!
		user: String!
		text: String!
	}

	enum SortDirection {
		asc
		desc
	}

	enum SortableArticleField {
		title
		views
		created
	}

	type Query {
		totalArticles: Int!
		articles(
			start: Int = 0
			first: Int = 10
			sortBy: SortableArticleField = created
			sort: SortDirection = desc
		): [Article!]!
		article(articleId: ID!): Article!
	}

	type Mutation {
		addArticle(input: AddArticleInput!): Article!
		editArticle(input: EditArticleInput!): Article!
		removeArticle(articleId: ID!): Article!
		addComment(input: AddComment!): Comment!
		uploadFile(file: Upload!): File!
	}

	type Subscription {
		newComment: Comment!
	}
`;
