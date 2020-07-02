import nodemailer from 'nodemailer';

export const sendEmail = async (
	to: string,
	subject: string,
	text?: string,
	html?: string,
): Promise<boolean> => {
	const emailAccount = {
		user: String(process.env.GMAIL_USER),
		pass: String(process.env.GMAIL_PASSWORD),
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
