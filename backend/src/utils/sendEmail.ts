import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, url: string) => {
	const account = await nodemailer.createTestAccount();

	let transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
		auth: {
			user: account.user,
			pass: account.pass,
		},
	});

	let info = await transporter.sendMail({
		from: 'Adminka',
		to: to,
		subject: 'Change password',
		html: `<a href="${url}">reset password</a>`,
	});

	console.log('Message sent: %s', info.messageId);
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
