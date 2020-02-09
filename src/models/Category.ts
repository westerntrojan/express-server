import {Schema, model, Document} from 'mongoose';
import slugify from 'slugify';

const CategorySchema: Schema = new Schema({
	title: {
		type: String,
		trim: true,
		required: true
	},
	desc: {
		type: String,
		trim: true,
		required: true
	},
	sub: {
		type: Number,
		default: 0
	},
	slug: {
		type: String,
		trim: true
	}
});

CategorySchema.index({name: 1});

CategorySchema.pre('save', function(next) {
	(this as ICategory).slug = slugify((this as ICategory).title, {
		lower: true,
		replacement: '-'
	});

	next();
});

export interface ICategory extends Document {
	title: string;
	desc: string;
	sub: number;
	slug: string;
}

export default model<ICategory>('categories', CategorySchema);
