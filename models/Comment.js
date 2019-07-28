const {Schema, model} = require('mongoose');

const CommentSchema = new Schema({
	articleId: {
		type: Schema.Types.ObjectId,
		ref: 'articles',
	},
	username: {
		type: String,
		trim: true,
		required: true,
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
