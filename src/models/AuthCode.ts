import {Schema, model, Document} from 'mongoose';

const AuthCode: Schema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	code: {
		type: Number,
		required: true,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface IAuthCode extends Document {
	userId: string;
	code: number;
	created?: Date;
}

export default model<IAuthCode>('auth_codes', AuthCode);
