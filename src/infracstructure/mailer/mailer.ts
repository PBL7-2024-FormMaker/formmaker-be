import * as path from 'path';

import { Prisma } from '@prisma/client';
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

  public sendPasswordResetEmail(email: string, resetUrl: string) {
    const to = email;
    const from = '"Formmaker" <formmakersp2024@gmail.com>';
    const subject = 'Reset password';
    const message = {
      resetUrl: resetUrl,
    };
    this.send({ to, from, subject }, 'password-reset', { message });
  }

  public sendInviteToTeamEmail(
    email: string,
    senderName: string,
    team: string,
    invitedUrl: string,
  ) {
    const to = email;
    const from = '"Formmaker" <formmakersp2024@gmail.com>';
    const subject = `${senderName} invited you to join ${team}`;
    const message = {
      invitedUrl: invitedUrl,
      email: email,
      team: team,
      senderName: senderName,
    };
    this.send({ to, from, subject }, 'invite-to-team', { message });
  }
  public sendNotificationResponse(
    email: string,
    formTitle: string,
    responsePath: string,
    formAnswers: Prisma.JsonValue[],
    elementIdAndNameList: {
      elementId: string;
      elementName: string;
    }[],
  ) {
    const to = email;
    const from = '"Formmaker" <formmakersp2024@gmail.com>';
    const subject = `You have a response for ${formTitle}`;
    const message = {
      formTitle: formTitle,
      responsePath: responsePath,
      formAnswers: formAnswers,
      elementIdAndNameList: elementIdAndNameList,
    };

    this.send({ to, from, subject }, 'send-notification', { message });
  }

  public sendInviteToFormEmail(
    email: string,
    senderName: string,
    form: string,
    invitedUrl: string,
  ) {
    const to = email;
    const from = '"Formmaker" <formmakersp2024@gmail.com>';
    const subject = `${senderName} invited you to ${form} for collaboration`;
    const message = {
      invitedUrl: invitedUrl,
      email: email,
      form: form,
      senderName: senderName,
    };
    this.send({ to, from, subject }, 'invite-to-form', { message });
  }
}
