const {check} = require('express-validator');

exports.articleValidators = [
	check('title')
		.isLength({max: 40})
		.withMessage('Invalid Title')
		.trim(),
	check('text')
		.isLength({max: 240})
		.withMessage('Invalid Text')
		.trim(),
];

exports.commentValidators = [
	check('username')
		.isLength({max: 40})
		.withMessage('Invalid Username')
		.trim(),
	check('text')
		.isLength({max: 240})
		.withMessage('Invalid Text')
		.trim(),
];
