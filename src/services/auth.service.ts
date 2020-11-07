import randomColor from 'randomcolor';
import jwt from 'jsonwebtoken';

import {User, AuthCode} from '../models';
import {IUser, IValidUser} from '../models/User';
import {sendEmail} from '../utils/email';

const isTest = process.env.NODE_ENV === 'test';

class AuthService {
	async createCode({
		user,
	}: {
		user: IUser;
	}): Promise<{success: true} | {success: false; message: string}> {
		const code = Math.floor(100000 + Math.random() * 900000); // Example - 341772
		const text = `Code: ${code}`;
		const result = await sendEmail(user.email, 'Your verification code', text);

		if (!result) {
			return {success: false, message: 'Something went wrong. Try logging in later'};
		}

		await AuthCode.create({userId: user._id, code: code.toString()});

		return {success: true};
	}

	async verifyCode({
		userId,
		code,
	}: {
		userId: string;
		code: string;
	}): Promise<
		{success: true; user: IValidUser; token: string} | {success: false; message: string}
	> {
		const authCode = await AuthCode.findOne({userId, code});
		const user = await User.findById(userId);

		if (!authCode || !user) {
			return {success: false, message: 'Invalid verification code'};
		}

		await AuthCode.deleteOne({userId, code});

		return {success: true, user: user.getValidUser(), token: user.generateToken()};
	}

	async register({
		data,
	}: {
		data: IUser;
	}): Promise<{success: true} | {success: false; message: string}> {
		const userVerification = await User.findOne({email: data.email, isRemoved: false});

		if (userVerification) {
			return {success: false, message: 'User exists'};
		}

		const newUser = new User({...data, emailVerified: isTest});
		newUser.password = await newUser.hashPassword(data.password);
		newUser.avatar.color = randomColor({luminosity: 'dark', format: 'rgb'});
		await newUser.save();

		if (!isTest) {
			const token = newUser.generateToken();
			const html = `
			<a href="${process.env.CLIENT_URI}/register/verify/${token}">Link</a>
			<br/>
			<br/>
			Or, copy and paste the following URL into your browser: ${process.env.CLIENT_URI}/register/verify/${token}
		`;
			const result = await sendEmail(newUser.email, 'Verify your email', '', html);

			if (!result) {
				return {success: false, message: 'Something went wrong. Try logging in later'};
			}
		}

		return {success: true};
	}

	async passwordReset({
		userId,
		newPassword,
	}: {
		userId: string;
		newPassword: string;
	}): Promise<{success: true} | {success: false; message: string}> {
		const user = await User.findOne({_id: userId, emailVerified: true});

		if (!user) {
			return {success: false, message: 'User not found'};
		}

		const correctPassword = await user.validatePassword(newPassword);

		if (correctPassword) {
			return {
				success: false,
				message: 'The current password will match the past. Please enter another',
			};
		}

		user.password = await user.hashPassword(newPassword);
		await user.save();

		return {success: true};
	}

	async passwordResetSendEmail({
		email,
	}: {
		email: string;
	}): Promise<{success: true} | {success: false; message: string}> {
		const user = await User.findOne({email, emailVerified: true});

		if (!user) {
			return {success: false, message: 'User not found'};
		}

		const token = user.generateToken();
		const html = `
			<a href="${process.env.CLIENT_URI}/password_reset/verify/${token}">Link</a>
			<br/>
			<br/>
			You can use the following link to reset your password: ${process.env.CLIENT_URI}/password_reset/verify/${token}
		`;
		const result = await sendEmail(user.email, 'Please reset your password', '', html);

		if (!result) {
			return {success: false, message: 'Something went wrong. Try again'};
		}

		return {success: true};
	}

	async verify({
		token,
	}: {
		token: string;
	}): Promise<{success: true; user: IValidUser} | {success: false; message: string}> {
		try {
			const decoded: any = jwt.verify(String(token), String(process.env.JWT_SIGNATURE));

			const user = await User.findOne({
				_id: decoded.data.userId,
				emailVerified: true,
				isRemoved: false,
			});

			if (!user) {
				return {success: false, message: 'User not found'};
			}

			return {success: true, user: user.getValidUser()};
		} catch (err) {
			return {success: false, message: 'Something went wrong. Try again'};
		}
	}
}

export default new AuthService();
