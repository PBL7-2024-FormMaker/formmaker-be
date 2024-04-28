import { getUsersService, UsersService } from '../services/users.service';

const usersService: UsersService = getUsersService();

export const findUserById = async (userId: string) =>
  await usersService.getUserByID(userId);
