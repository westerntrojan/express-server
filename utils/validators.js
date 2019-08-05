const {check} = require('express-validator');

exports.articleValidators = [
	check('title')
		.isLength({max: 40})
		.withMessage('Invalid Title(Max: 40)')
		.trim(),
	check('text')
		.isLength({max: 240})
		.withMessage('Invalid Text(Max: 240)')
		.trim(),
];

exports.commentValidators = [
	check('text')
		.isLength({max: 240})
		.withMessage('Invalid Text(Max: 240)')
		.trim(),
];

exports.registerValidators = [
	check('username')
		.isLength({max: 40})
		.withMessage('Invalid Username(Max: 40)')
		.trim(),
	check('email')
		.isLength({max: 40})
		.isEmail()
		.withMessage('Invalid Email')
		.trim(),
	check('password')
		.isLength({min: 4, max: 240})
		.withMessage('Invalid Password(Min: 4, Max: 240)')
		.trim(),
];

exports.loginValidators = [
	check('username')
		.isLength({max: 40})
		.withMessage('Invalid Username(Max: 40)')
		.trim(),
	check('password')
		.isLength({min: 4, max: 240})
		.withMessage('Invalid Password(Min: 4, Max: 240)')
		.trim(),
];

exports.editUserValidators = [
	check('username')
		.isLength({max: 40})
		.withMessage('Invalid Username(Max: 40)')
		.trim(),
	check('email')
		.isLength({max: 40})
		.isEmail()
		.withMessage('Invalid Email')
		.trim(),
];
