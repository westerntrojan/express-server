import {Schema, model, Document} from 'mongoose';

const UserSchema: Schema = new Schema({
	firstName: {
		type: String,
		trim: true,
		required: true,
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
	},
	username: {
		type: String,
		trim: true,
		default: '',
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
		required: true,
	},
	bio: {
		type: String,
		default: '',
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

UserSchema.index({username: 1, firstName: 1, lastName: 1, email: 1});

export interface UserInterface extends Document {
	_id: string;
	firstName: string;
	lastName?: string;
	username?: string;
	email: string;
	password: string;
	avatar: string;
	bio?: string;
	role: number;
	isRemoved: boolean;
	created: string;
}

export default model<UserInterface>('users', UserSchema);
