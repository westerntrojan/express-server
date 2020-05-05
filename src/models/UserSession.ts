import {Schema, model, Document} from 'mongoose';

const UserSessionSchema: Schema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface IUserSession extends Document {
	userId: string;
	created: Date;
}

export default model<IUserSession>('sessions', UserSessionSchema);
