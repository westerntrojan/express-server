import {check} from 'express-validator';

export const articleValidators = [
	check('title')
		.isLength({max: 100})
		.withMessage('Invalid Title(Max: 100)')
		.trim(),
	check('text')
		.isLength({max: 5000})
		.withMessage('Invalid Text(Max: 5000)')
		.trim(),
];

export const commentValidators = [
	check('text')
		.isLength({max: 2000})
		.withMessage('Invalid Text(Max: 2000)')
		.trim(),
];

export const registerValidators = [
	check('firstName')
		.isLength({max: 20})
		.withMessage('Invalid First Name(Max: 20)')
		.trim(),
	check('lastName')
		.isLength({max: 20})
		.withMessage('Invalid Last name(Max: 20)')
		.trim(),
	check('email')
		.isEmail()
		.withMessage('Invalid Email'),
	check('password')
		.isLength({min: 4, max: 240})
		.withMessage('Invalid Password(Min: 4, Max: 240)')
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
	check('info.bio')
		.isLength({max: 400})
		.withMessage('Invalid Bio(Max: 400)')
		.trim(),
];
