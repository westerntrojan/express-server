const Sequelize = require('sequelize');
const sequelize = require('../db');

const Comment = sequelize.define('Comment', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	username: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	text: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
});

module.exports = Comment;
