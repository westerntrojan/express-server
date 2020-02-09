import {Schema, model, Document} from 'mongoose';

const UserChatSchema: Schema = new Schema({
	from: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	to: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

export interface IUserChat extends Document {
	from: string;
	to: string;
	created?: Date;
}

export default model<IUserChat>('user-chats', UserChatSchema);
