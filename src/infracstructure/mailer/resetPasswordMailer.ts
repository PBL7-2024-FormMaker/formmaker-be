import { getMailService, Mailer } from './mailer';

let instance: ResetPasswordMailer | null = null;

export const getResetPasswordMailer = () => {
  if (!instance) {
    instance = new ResetPasswordMailer();
  }
  return instance;
};
export class ResetPasswordMailer {
  private mailer: Mailer;
  public constructor() {
    this.mailer = getMailService();
  }
  public sendPasswordResetEmail(email: string, resetUrl: string) {
    const to = email;
    const from = '"Formmaker" <formmakersp2024@gmail.com>';
    const subject = 'Reset password';
    const message = {
      resetUrl: resetUrl,
    };
    this.mailer.send({ to, from, subject }, 'password-reset', { message });
  }
}
