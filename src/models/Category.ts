import {Schema, model, Document} from 'mongoose';

import {getSlug} from '../utils/app';

const CategorySchema: Schema = new Schema({
	title: {
		type: String,
		trim: true,
		required: true,
	},
	desc: {
		type: String,
		trim: true,
		required: true,
	},
	subs: {
		type: Number,
		default: 0,
	},
	slug: {
		type: String,
		trim: true,
	},
});

CategorySchema.index({name: 1});

CategorySchema.pre('save', function(next) {
	const self = this as ICategory;

	self.slug = getSlug(self.title);

	next();
});

export interface ICategory extends Document {
	title: string;
	desc: string;
	subs?: number;
	slug?: string;
}

export default model<ICategory>('categories', CategorySchema);
