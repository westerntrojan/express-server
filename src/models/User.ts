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
	slug: {
		type: String,
		trim: true,
		default: '',
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre('save', function(next) {
	(this as any).slug = (this as any).username
		.split(' ')
		.join('-')
		.toLowerCase();

	next();
});

export interface UserInterface extends Document {
	_doc?: UserInterface;
	username: string;
	email: string;
	password: string;
	avatar: string;
	role: number;
	isRemoved: boolean;
	slug: string;
	created: string;
}

export default model<UserInterface>('users', UserSchema);
