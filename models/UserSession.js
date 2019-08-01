const {Schema, model} = require('mongoose');

const UserSessionSchema = new Schema({
	userId: {
		type: String,
		default: 0,
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

module.exports = model('sessions', UserSessionSchema);
