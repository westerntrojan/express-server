import {Schema, model, Document} from 'mongoose';
import slugify from 'slugify';

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
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.index({slug: 1}, {name: 'slug_index'});

UserSchema.pre('save', function(next) {
	(this as any).slug = slugify((this as any).username, {
		lower: true,
		replacement: '-',
	});

	next();
});

export interface UserInterface extends Document {
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
