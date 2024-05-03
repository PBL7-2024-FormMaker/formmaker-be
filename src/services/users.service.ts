import { hashSync } from 'bcryptjs';

import prisma from '../configs/db.config';
import { SALT_ROUNDS } from '../configs/secrets';
import { UpdateUserSchemaType } from '../schemas/users.schemas';

let instance: UsersService | null = null;

export const getUsersService = () => {
  if (!instance) {
    instance = new UsersService();
  }
  return instance;
};

export class UsersService {
  public getAllUsers = () => prisma.user.findMany();

  public getUserByID = (id: string) =>
    prisma.user.findUnique({
      where: {
        id,
      },
    });

  public delUserByID = (id: string) =>
    prisma.user.delete({
      where: {
        id,
      },
    });

  public changePassword = (id: string, newPassword: string) =>
    prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hashSync(newPassword, SALT_ROUNDS),
        passwordChangedAt: new Date(Date.now()),
      },
    });

  public updateUserByID = (id: string, user: UpdateUserSchemaType) =>
    prisma.user.update({
      where: {
        id,
      },
      data: {
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        organizationName: user.organizationName,
        organizationLogo: user.organizationLogo,
      },
    });

  public getFavouriteFormsOfUser = (userId: string) =>
    prisma.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .favouriteForms();

  public async resetPassword(userId: string, password: string) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashSync(password, SALT_ROUNDS),
      },
    });
  }
}
