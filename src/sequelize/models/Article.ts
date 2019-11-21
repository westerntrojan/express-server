import {Model, DataTypes, HasManyAddAssociationMixin, literal} from 'sequelize';
import slugify from 'slugify';

import db from '../db';
import Comment from './Comment';
import Tag from './Tag';

class Article extends Model {
	public article_id!: number;
	public title!: string;
	public text!: string;
	public slug!: string;

	public readonly created_at!: Date;
	public readonly updated_at!: Date;

	public setTags!: HasManyAddAssociationMixin<Article, Tag[]>;
	public addTag!: HasManyAddAssociationMixin<Article, Tag>;
	public removeTags!: HasManyAddAssociationMixin<Article, Tag[]>;
	public removeTag!: HasManyAddAssociationMixin<Article, Tag>;
}

Article.init(
	{
		article_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		title: {
			type: new DataTypes.STRING(255),
			allowNull: false,
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		slug: {
			type: new DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: 'article',
		indexes: [
			{
				fields: ['title', 'slug'],
				unique: true,
			},
		],
	},
);

Article.beforeValidate((article: Article) => {
	article.slug = slugify(article.title, {
		lower: true,
		replacement: '-',
	});
});

// one to many
Article.hasMany(Comment, {
	sourceKey: 'article_id',
	foreignKey: 'article_id',
	as: 'comments',
	onDelete: 'cascade',
});

// many to many
Article.belongsToMany(Tag, {
	through: 'article_tag',
	as: 'tags',
	foreignKey: 'article_id',
	otherKey: 'tag_id',
	onDelete: 'cascade',
});
Tag.belongsToMany(Article, {
	through: 'article_tag',
	as: 'articles',
	foreignKey: 'tag_id',
	otherKey: 'article_id',
	onDelete: 'cascade',
});

export default Article;
