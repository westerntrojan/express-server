import {Schema, model, Document} from 'mongoose';

enum Type {
	TEXT = 'text',
	IMAGE = 'image',
	IMAGE_CAPTION = 'image_caption',
}

const MessageSchema: Schema = new Schema({
	chatId: {
		type: Schema.Types.ObjectId,
		ref: 'user-chats',
		default: null,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	text: {
		type: String,
		default: '',
		trim: true,
	},
	isRead: {
		type: Boolean,
		default: false,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface IMessage extends Document {
	chatId?: string | null;
	user: string;
	text: string;
	isRead: boolean;
	created?: string;
}

export default model<IMessage>('messages', MessageSchema);
