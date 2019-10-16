import {Schema, model, Document} from 'mongoose';

import {CommentInterface} from './Comment';

const ArticleSchema: Schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	title: {
		type: String,
		trim: true,
		required: true,
	},
	text: {
		type: String,
		trim: true,
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
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface ArticleInterface extends Document {
	user: string;
	title: string;
	text: string;
	image: string;
	views: number;
	comments: [CommentInterface];
	created: string;
}

export default model<ArticleInterface>('articles', ArticleSchema);
