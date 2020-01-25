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
	info: {
		bio: {
			type: String,
			trim: true,
			default: '',
		},
	},
	role: {
		type: Number,
		default: 2,
	},
	isRemoved: {
		type: Boolean,
		default: false,
	},
	favorite: [],
	created: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.index({username: 1});
UserSchema.index({email: 1});

export interface IUser extends Document {
	firstName: string;
	lastName?: string;
	username?: string;
	email: string;
	password: string;
	avatar: string;
	info: {
		bio?: string;
	};
	role?: number;
	isRemoved?: boolean;
	created?: Date;
}

export default model<IUser>('users', UserSchema);
