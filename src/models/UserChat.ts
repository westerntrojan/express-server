import {Schema, model, Document} from 'mongoose';

const UserChatSchema: Schema = new Schema({
	from: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	to: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	removeFor: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface UserChatInterface extends Document {
	from: string;
	to: string;
	removeFor: string;
	created: string;
}

export default model<UserChatInterface>('users-chats', UserChatSchema);
