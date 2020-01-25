import {Schema, model, Document} from 'mongoose';
import slugify from 'slugify';

import {IComment} from './Comment';

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
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: 'comments',
			},
		],
		category: {
			type: String,
			required: true,
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
ArticleSchema.index({slug: 1}, {unique: true});

ArticleSchema.pre('save', function(next) {
	(this as IArticle).slug = slugify((this as IArticle).title, {
		lower: true,
		replacement: '-',
	});

	next();
});

export interface IArticle extends Document {
	user: string;
	title: string;
	text: string;
	image?: string;
	views: number;
	tags?: string[];
	slug?: string;
	comments: IComment[];
	created?: Date;
}

export default model<IArticle>('articles', ArticleSchema);
