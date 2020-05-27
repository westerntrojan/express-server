import jwt from 'jsonwebtoken';
import config from 'config';

import {IUser} from '../models/User';

const jwt_signature = config.get('jwt_signature');

export const generateToken = (user: IUser): string => {
	const data = {
		userId: user._id,
		email: user.email,
	};
	const signature = String(jwt_signature);
	const expiration = '4h';

	return jwt.sign({data}, signature, {expiresIn: expiration});
};
