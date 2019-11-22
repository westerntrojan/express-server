import {Model, DataTypes} from 'sequelize';
import slugify from 'slugify';

import db from '../db';

class Tag extends Model {
	public tagId!: number;
	public name!: string;
	public slug!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Tag.init(
	{
		tagId: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
			field: 'tag_id',
		},
		name: {
			type: new DataTypes.STRING(255),
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
		tableName: 'tag',
		underscored: true,
		indexes: [
			{
				fields: ['name', 'slug'],
				unique: true,
			},
		],
	},
);

Tag.beforeValidate(tag => {
	tag.slug = slugify(tag.name, {
		lower: true,
		replacement: '-',
	});
});

export default Tag;
