import {Schema, model} from 'mongoose';

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
	created_at: {
		type: Date,
		default: Date.now,
	},
});

module.exports = model('comments', CommentSchema);
