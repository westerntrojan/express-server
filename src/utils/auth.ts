import jwt from 'jsonwebtoken';

import {IUser} from '../models/User';

const jwt_signature = String(process.env.JWT_SIGNATURE);

export const generateToken = (user: IUser): string => {
	const data = {
		userId: user._id,
		email: user.email,
	};
	const signature = String(jwt_signature);
	const expiresIn = '6h';

	return jwt.sign({data}, signature, {expiresIn});
};
