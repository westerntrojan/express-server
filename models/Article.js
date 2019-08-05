const {Schema, model} = require('mongoose');

const ArticleSchema = new Schema({
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
	created_at: {
		type: Date,
		default: Date.now,
	},
});

module.exports = model('articles', ArticleSchema);
