const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
	username: {
		type: String,
		trim: true,
		required: true,
	},
	email: {
		type: String,
		trim: true,
		required: true,
	},
	password: {
		type: String,
		trim: true,
		required: true,
	},
	articles: {
		type: Number,
		default: 0,
	},
	comments: {
		type: Number,
		default: 0,
	},
	role: {
		type: Number,
		default: 2,
	},
	isRemoved: {
		type: Boolean,
		default: false,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

module.exports = model('users', UserSchema);
