import nodemailer from 'nodemailer';
import config from 'config';

export const sendEmail = async (
	to: string,
	subject: string,
	text?: string,
	html?: string,
): Promise<boolean> => {
	const emailAccount = {
		user: String(config.get('gmail.user')),
		pass: String(config.get('gmail.password')),
	};

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: emailAccount.user,
			pass: emailAccount.pass,
		},
	});

	const result = await transporter.sendMail({
		from: emailAccount.user,
		to,
		subject,
		text,
		html,
	});

	if (!result) {
		return false;
	}

	return true;
};
