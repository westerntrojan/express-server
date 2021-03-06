import {check} from 'express-validator';

export const articleValidators = [
	check('title')
		.isLength({max: 120})
		.withMessage('Invalid Title(Max: 120)')
		.trim(),
	check('text')
		.isLength({max: 5000})
		.withMessage('Invalid Text(Max: 5000)')
		.trim(),
];

export const commentValidators = [
	check('text')
		.trim()
		.isLength({max: 3000})
		.withMessage('Max length 3000'),
];

export const registerValidators = [
	check('user.firstName')
		.isLength({max: 20})
		.withMessage('Invalid First Name(Max: 20)')
		.trim(),
	check('user.lastName')
		.isLength({max: 20})
		.withMessage('Invalid Last name(Max: 20)')
		.trim(),
	check('user.email')
		.isEmail()
		.withMessage('Invalid Email'),
	check('user.password')
		.isLength({min: 4})
		.withMessage('Invalid Password(Min: 4)')
		.trim(),
];

export const editUserValidators = [
	check('firstName')
		.isLength({max: 20})
		.withMessage('Invalid First Name(Max: 20)')
		.trim(),
	check('lastName')
		.isLength({max: 20})
		.withMessage('Invalid Last name(Max: 20)')
		.trim(),
	check('username')
		.isLength({max: 40})
		.withMessage('Invalid (Max: 40)')
		.trim(),
	check('email')
		.isEmail()
		.withMessage('Invalid Email')
		.trim(),
	check('bio')
		.isLength({max: 1000})
		.withMessage('Invalid Bio(Max: 1000)')
		.trim(),
];

export const categoryValidators = [
	check('title')
		.isLength({max: 50})
		.withMessage('Invalid Title(Max: 50)')
		.trim(),
	check('desc')
		.isLength({max: 3000})
		.withMessage('Invalid Description(Max: 3000)')
		.trim(),
];
