import * as path from 'path';

import Email from 'email-templates';
import { createTransport } from 'nodemailer';

const config = {
  transporter: {
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
  },
  template: {
    views: {
      root: path.resolve('src/infracstructure/mailer/templates/'),
      options: {
        extension: 'hbs',
      },
    },
    message: undefined,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: path.resolve('assets'),
        images: true,
      },
    },
  },
};
let instance: Mailer | null = null;

export const getMailService = () => {
  if (!instance) {
    instance = new Mailer();
  }
  return instance;
};

export class Mailer {
  public transporter = createTransport(config.transporter);
  public template = new Email(config.template);

  public send = async (
    options: {
      to: string;
      from: string;
      subject: string;
    },
    template: string = 'password-reset',
    vars: unknown = { message: 'message of test' },
  ) => {
    const html = await this.template.render(template, vars);
    await this.transporter.sendMail({ ...options, html });
  };
}
