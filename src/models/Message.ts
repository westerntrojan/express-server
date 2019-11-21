import {Schema, model, Document} from 'mongoose';

const MessageSchema: Schema = new Schema({
	chatId: {
		type: 'string',
		default: 'main',
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	text: {
		type: String,
		required: true,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface MessageInterface extends Document {
	chatId: string;
	user: any;
	text: string;
	created: string;
}

export default model<MessageInterface>('messages', MessageSchema);
