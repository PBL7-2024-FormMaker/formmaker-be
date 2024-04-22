import { hashSync } from 'bcrypt';

import prisma from '../configs/db.config';
import { SALT_ROUNDS } from '../configs/secrets';

let instance: AuthService | null = null;

export const getAuthService = () => {
  if (!instance) {
    instance = new AuthService();
  }
  return instance;
};

export class AuthService {
  public async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  public async checkExist(email: string) {
    const existingUser = await this.getUserByEmail(email);
    return existingUser !== null;
  }

  public async createUser(email: string, password: string, username: string) {
    return await prisma.user.create({
      data: {
        email,
        password: hashSync(password, SALT_ROUNDS),
        username,
      },
    });
  }
}
