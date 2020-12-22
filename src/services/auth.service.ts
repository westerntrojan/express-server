import randomColor from 'randomcolor';

import {User, AuthCode} from '../models';
import {IUser, IValidUser} from '../models/User';
import {sendEmail} from '../utils/email';
import {getUniqueCode} from '../utils/common';
import {verifyToken} from '../utils/auth';

const isTest = process.env.NODE_ENV === 'test';

class AuthService {
	async createCode({
		user,
	}: {
		user: IUser;
	}): Promise<{success: true} | {success: false; message: string}> {
		const code = getUniqueCode();
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
		data: {
			user: IUser;
			registerUri: string;
		};
	}): Promise<{success: true} | {success: false; message: string}> {
		const userVerification = await User.findOne({email: data.user.email, isRemoved: false});

		if (userVerification) {
			return {success: false, message: 'User exists'};
		}

		const newUser = new User({...data.user, emailVerified: isTest});
		newUser.password = await newUser.hashPassword(data.user.password);
		newUser.avatar.color = randomColor({luminosity: 'dark', format: 'rgb'});
		await newUser.save();

		if (!isTest) {
			const token = newUser.generateToken();
			const html = `
			<a href="${data.registerUri}/${token}">Link</a>
			<br/>
			<br/>
			Or, copy and paste the following URL into your browser: ${data.registerUri}/${token}
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
		passwordResetUri,
	}: {
		email: string;
		passwordResetUri: string;
	}): Promise<{success: true} | {success: false; message: string}> {
		const user = await User.findOne({email, emailVerified: true});

		if (!user) {
			return {success: false, message: 'User not found'};
		}

		const token = user.generateToken();
		const html = `
			<a href="${passwordResetUri}/${token}">Link</a>
			<br/>
			<br/>
			You can use the following link to reset your password: ${passwordResetUri}/${token}
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
			const user = await verifyToken(token);

			if (!user) {
				return {success: false, message: 'User not found'};
			}

			return {success: true, user};
		} catch (err) {
			return {success: false, message: 'Something went wrong. Try again'};
		}
	}
}

export default new AuthService();
