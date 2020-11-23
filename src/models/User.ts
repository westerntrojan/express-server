import {Schema, model, Document} from 'mongoose';
import argon2 from 'argon2';

import {generateToken} from '../utils/auth';

export enum Role {
	ADMIN,
	MODERATOR,
	USER,
}

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
		images: [
			{
				type: String,
				trim: true,
				default: '',
			},
		],
		color: {
			type: String,
			trim: true,
		},
	},
	bio: {
		type: String,
		trim: true,
		default: '',
	},
	role: {
		type: Number,
		default: Role.USER,
	},
	bookmarks: [
		{
			type: Schema.Types.ObjectId,
			ref: 'articles',
		},
	],
	following: [
		{
			type: Schema.Types.ObjectId,
			ref: 'users',
		},
	],
	isRemoved: {
		type: Boolean,
		default: false,
	},
	emailVerified: {
		type: Boolean,
		default: false,
	},
	twoFactorAuth: {
		type: Boolean,
		default: false,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.index({username: 1});
UserSchema.index({email: 1});

UserSchema.methods.hashPassword = async function(password: string): Promise<string> {
	return argon2.hash(password);
};

UserSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
	return argon2.verify(this.password, password);
};

UserSchema.methods.generateToken = function(): string {
	return generateToken(this as IUser);
};

export interface IValidUser {
	_id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	avatar: {
		images: string[];
		color: string;
	};
	bio: string;
	role: Role.ADMIN | Role.MODERATOR | Role.USER;
	bookmarks: string[];
	following: string[];
	isRemoved: boolean;
	emailVerified: boolean;
	twoFactorAuth: boolean;
	created: Date;
}

UserSchema.methods.getValidUser = function(): IValidUser {
	return {
		_id: this._id,
		firstName: this.firstName,
		lastName: this.lastName,
		username: this.username,
		email: this.email,
		avatar: this.avatar,
		bio: this.bio,
		role: this.role,
		bookmarks: this.bookmarks,
		following: this.following,
		isRemoved: this.isRemoved,
		emailVerified: this.emailVerified,
		twoFactorAuth: this.twoFactorAuth,
		created: this.created,
	};
};

export interface IUser extends Document {
	firstName: string;
	lastName?: string;
	username?: string;
	email: string;
	password: string;
	avatar: {
		images: string[];
		color: string;
	};
	bio?: string;
	role?: Role.ADMIN | Role.MODERATOR | Role.USER;
	bookmarks: string[];
	following: string[];
	isRemoved?: boolean;
	emailVerified?: boolean;
	twoFactorAuth?: boolean;
	created?: Date;
	hashPassword: (password: string) => Promise<string>;
	validatePassword: (password: string) => Promise<boolean>;
	generateToken: () => string;
	getValidUser: () => IValidUser;
}

export default model<IUser>('users', UserSchema);
