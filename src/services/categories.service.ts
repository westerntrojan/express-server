import Article, {IArticle} from '../models/Article';
import Category, {ICategory} from '../models/Category';
import {removeArticle} from '../utils/articles';
import {getSlug} from '../utils/common';

type ReturningData = {success: true; category: ICategory} | {success: false; message: string};

class CategoriesService {
	async createCategory({data}: {data: ICategory}): Promise<ReturningData> {
		const slug = getSlug(data.title);

		const slugValidate = await Category.findOne({slug});

		if (slugValidate) {
			return {success: false, message: 'This category exists.'};
		}

		const newCategory = await Category.create(data);

		return {success: true, category: newCategory};
	}

	async getCategories(): Promise<ICategory[]> {
		return Category.find();
	}

	async getCategory({slug}: {slug: string}): Promise<ReturningData> {
		const category = await Category.findOne({slug});

		if (!category) {
			return {success: false, message: 'Category not found'};
		}

		return {success: true, category};
	}

	async updateCategory({
		categoryId,
		data,
	}: {
		categoryId: string;
		data: ICategory;
	}): Promise<ReturningData> {
		const slug = getSlug(data.title);

		const slugValidate = await Category.findOne({_id: {$ne: categoryId}, slug});

		if (slugValidate) {
			return {success: false, message: 'This category exists'};
		}

		const updatedCategory = await Category.findByIdAndUpdate(
			categoryId,
			{$set: {...data, slug}},
			{new: true},
		);

		if (!updatedCategory) {
			return {success: false, message: 'Category not found'};
		}

		return {success: true, category: updatedCategory};
	}

	async removeCategories({categoriesIds}: {categoriesIds: string[]}): Promise<void> {
		await Promise.all(
			categoriesIds.map(async (categoryId: string) => {
				await Category.deleteOne({_id: categoryId});

				const articles = await Article.find({category: categoryId});

				await Promise.all(articles.map(async article => removeArticle(article._id)));
			}),
		);
	}

	async getCategoryArticles({
		categoryId,
		skip,
	}: {
		categoryId: string;
		skip: number;
	}): Promise<IArticle[]> {
		return Article.find({category: categoryId})
			.sort({created: -1})
			.skip(skip)
			.limit(10)
			.populate('user')
			.populate({
				path: 'comments',
				options: {
					populate: {
						path: 'replies',
					},
				},
			});
	}
}

export default new CategoriesService();
