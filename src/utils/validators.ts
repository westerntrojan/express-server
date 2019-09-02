import {check} from 'express-validator';

export const articleValidators = [
	check('title')
		.isLength({max: 40})
		.withMessage('Invalid Title(Max: 40)')
		.trim(),
	check('text')
		.isLength({max: 4000})
		.withMessage('Invalid Text(Max: 4000)')
		.trim(),
];

export const commentValidators = [
	check('text')
		.isLength({max: 4000})
		.withMessage('Invalid Text(Max: 400)')
		.trim(),
];

export const registerValidators = [
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

export const loginValidators = [
	check('username')
		.isLength({max: 40})
		.withMessage('Invalid Username(Max: 40)')
		.trim(),
	check('password')
		.isLength({min: 4, max: 240})
		.withMessage('Invalid Password(Min: 4, Max: 240)')
		.trim(),
];

export const editUserValidators = [
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
