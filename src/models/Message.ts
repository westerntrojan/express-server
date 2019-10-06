import mongoose, {Schema, model, Document} from 'mongoose';

delete mongoose.connection.models['messages'];

const MessageSchema: Schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	text: {
		type: String,
		trim: true,
		required: true,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface MessageInterface extends Document {
	user: any;
	text: string;
	created: string;
}

export default model('messages', MessageSchema);
