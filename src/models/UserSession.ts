import {Schema, model} from 'mongoose';

const UserSessionSchema: Schema = new Schema({
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
