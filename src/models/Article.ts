import {Schema, model, Document} from 'mongoose';

import {IComment} from './Comment';
import {getSlug} from '../utils/app';

const ArticleSchema: Schema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			required: true,
		},
		title: {
			type: String,
			trim: true,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			trim: true,
			default: '',
		},
		views: {
			type: Number,
			default: 0,
		},
		likes: {
			type: Number,
			default: 0,
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: 'comments',
			},
		],
		category: {
			type: Schema.Types.ObjectId,
			ref: 'categories',
		},
		tags: [
			{
				type: String,
				trim: true,
			},
		],
		slug: {
			type: String,
			trim: true,
		},
		created: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collation: {
			locale: 'en_US',
			strength: 1,
			caseLevel: true,
		},
	},
);

ArticleSchema.index({title: 1});
ArticleSchema.index({category: 1});

ArticleSchema.pre('save', function(next) {
	const self = this as IArticle;

	self.slug = getSlug(self.title);

	next();
});

export interface IArticle extends Document {
	user: string;
	title: string;
	text: string;
	image: string;
	views: number;
	likes: number;
	category: string;
	tags?: string[];
	slug?: string;
	comments: IComment[];
	created?: Date;
}

export default model<IArticle>('articles', ArticleSchema);
