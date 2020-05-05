import {Schema, model, Document} from 'mongoose';
import randomColor from 'randomcolor';
import {hash} from '../utils/auth';

enum Role {
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
	info: {
		bio: {
			type: String,
			trim: true,
			default: '',
		},
	},
	role: {
		type: Number,
		default: Role.USER,
	},
	likedArticles: [
		{
			type: Schema.Types.ObjectId,
			ref: 'articles',
		},
	],
	isRemoved: {
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

UserSchema.pre('save', async function(next) {
	const self = this as IUser;

	self.avatar.color = randomColor({luminosity: 'dark', format: 'rgb'});
	self.password = await hash(self.password);

	next();
});

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
	info: {
		bio?: string;
	};
	role?: Role.ADMIN | Role.MODERATOR | Role.USER;
	likedArticles: string[];
	isRemoved?: boolean;
	created?: Date;
}

export default model<IUser>('users', UserSchema);
