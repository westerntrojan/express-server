import {Schema, model, Document} from 'mongoose';

const CommentSchema: Schema = new Schema({
	articleId: {
		type: Schema.Types.ObjectId,
		ref: 'articles',
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	likes: {
		type: Number,
		default: 0,
	},
	dislikes: {
		type: Number,
		default: 0,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface IComment extends Document {
	articleId: string;
	user: string;
	text: string;
	likes: number;
	dislikes: number;
	created?: Date;
}

export default model<IComment>('comments', CommentSchema);
