import {Schema, model, Document} from 'mongoose';
import randomColor from 'randomcolor';

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
	avatar: {
		type: String,
		trim: true,
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
	_doc?: UserInterface;
	username: string;
	email: string;
	password: string;
	avatar: string;
	role: number;
	isRemoved: boolean;
	created: string;
}

export default model<UserInterface>('users', UserSchema);
//
//
