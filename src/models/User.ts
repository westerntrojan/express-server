import {Schema, model, Document} from 'mongoose';

const UserSchema: Schema = new Schema({
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
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface UserInterface extends Document {
	username: string;
	email: string;
	password: string;
	articles: number;
	comments: number;
	role: number;
	isRemoved: boolean;
	created: string;
}

export default model('users', UserSchema);
