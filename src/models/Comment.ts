import {Schema, model, Document} from 'mongoose';

const CommentSchema: Schema = new Schema({
	articleId: {
		type: Schema.Types.ObjectId,
		ref: 'articles',
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	text: {
		type: String,
		trim: true,
		required: true,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface CommentInterface extends Document {
	articleId: string;
	user: any;
	text: string;
	created: string;
}

export default model('comments', CommentSchema);
