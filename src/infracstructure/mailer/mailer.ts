import nodemailer, { Transporter } from 'nodemailer';

import { optionType } from '../../types/option.types';

class Mailer {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  public async sendPasswordResetEmail(option: optionType) {
    try {
      // const html = await renderTemplate(resetUrl);
      const mailOptions = {
        from: '"Formmaker" <formmakersp2024@gmail.com>',
        to: option.email,
        subject: option.subject,
        text: option.message,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  }
}

export { Mailer };
