import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailOptions } from '@type/email';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
	private readonly logger = new Logger(EmailService.name);
	private transporter: nodemailer.Transporter;

	constructor(
		private readonly configService: ConfigService,
	) {
		const emailUser = this.configService.get<string>('EMAIL_USER');
		const emailPass = this.configService.get<string>('EMAIL_PASS');

		this.transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: emailUser,
			pass: emailPass,
		},
		});
	}

	async send({ subject, to, html }: SendEmailOptions): Promise<boolean> {
		try {
			this.logger.debug(`Sending email to ${to} with subject "${subject}"`);

			const info = await this.transporter.sendMail({
				from: this.configService.get<string>('EMAIL_USER'),
				to,
				subject,
				html,
			});

			this.logger.debug(`Email sent: ${info}`);
			return true;
		} catch (error) {
			this.logger.error(`Error sending email to ${to}:`, error);
			return false;
		}
	}
}
