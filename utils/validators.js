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

exports.registerValidators = [
	check('username')
		.isLength({max: 40})
		.withMessage('Invalid Username')
		.trim(),
	check('email')
		.isLength({max: 40})
		.isEmail()
		.withMessage('Invalid Email')
		.trim(),
	check('password')
		.isLength({min: 4, max: 240})
		.withMessage('Invalid Password')
		.trim(),
];

exports.loginValidators = [
	check('username')
		.isLength({max: 40})
		.withMessage('Invalid Username')
		.trim(),
	check('password')
		.isLength({min: 4, max: 240})
		.withMessage('Invalid Password')
		.trim(),
];

exports.editUserValidators = [
	check('username')
		.isLength({max: 40})
		.withMessage('Invalid Username')
		.trim(),
	check('email')
		.isLength({max: 40})
		.isEmail()
		.withMessage('Invalid Email')
		.trim(),
];
