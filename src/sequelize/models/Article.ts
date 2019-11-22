import {Model, DataTypes, HasManyAddAssociationMixin} from 'sequelize';
import slugify from 'slugify';

import db from '../db';
import Comment from './Comment';
import Tag from './Tag';

class Article extends Model {
	public articleId!: number;
	public title!: string;
	public text!: string;
	public slug!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public setTags!: HasManyAddAssociationMixin<Article, Tag[]>;
	public addTag!: HasManyAddAssociationMixin<Article, Tag>;
	public removeTags!: HasManyAddAssociationMixin<Article, Tag[]>;
	public removeTag!: HasManyAddAssociationMixin<Article, Tag>;
}

Article.init(
	{
		articleId: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
			field: 'article_id',
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
		createdAt: {
			type: DataTypes.DATE,
			field: 'created_at',
		},
		updatedAt: {
			type: DataTypes.DATE,
			field: 'updated_at',
		},
	},
	{
		sequelize: db,
		tableName: 'article',
		underscored: true,
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
	sourceKey: 'articleId',
	foreignKey: 'articleId',
	as: 'comments',
	onDelete: 'cascade',
});

// many to many
Article.belongsToMany(Tag, {
	through: 'article_tag',
	as: 'tags',
	foreignKey: 'articleId',
	otherKey: 'tagId',
	onDelete: 'cascade',
});
Tag.belongsToMany(Article, {
	through: 'article_tag',
	as: 'articles',
	foreignKey: 'tagId',
	otherKey: 'articleId',
	onDelete: 'cascade',
});

export default Article;
