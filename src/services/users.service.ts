import { hashSync } from 'bcrypt';

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

  public getUserByID = (id: number) =>
    prisma.user.findUnique({
      where: {
        id,
      },
    });

  public delUserByID = (id: number) =>
    prisma.user.delete({
      where: {
        id,
      },
    });

  public changePassword = (id: number, newPassword: string) =>
    prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hashSync(newPassword, SALT_ROUNDS),
        passwordChangedAt: new Date(Date.now()),
      },
    });

  public updateUserByID = (id: number, user: UpdateUserSchemaType) =>
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

  public getFavouriteFormsOfUser = (userId: number) =>
    prisma.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .favouriteForms();
}
