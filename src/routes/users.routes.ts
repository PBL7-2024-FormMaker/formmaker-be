import { Router } from 'express';

import { ROUTES } from '../constants';
import {
  getUsersController,
  UsersController,
} from '../controllers/users.controller';
import {
  checkUserExistence,
  validateChangePasswordInput,
  validateUpdateUserInput,
  verifyToken,
} from '../middlewares';

const usersRoute = Router();

const usersController: UsersController = getUsersController();

usersRoute.get(
  ROUTES.ROOT.PATH,
  verifyToken,
  checkUserExistence,
  usersController.getAllUsers,
);
usersRoute.get(
  ROUTES.USER.MY_PROFILE,
  verifyToken,
  checkUserExistence,
  usersController.getUserProfile,
);
usersRoute.delete(
  ROUTES.USER.DELETE_USER,
  verifyToken,
  checkUserExistence,
  usersController.delUserByID,
);
usersRoute.patch(
  ROUTES.USER.CHANGE_PASSWORD,
  verifyToken,
  checkUserExistence,
  validateChangePasswordInput,
  usersController.changePassword,
);
usersRoute.patch(
  ROUTES.USER.MY_PROFILE,
  verifyToken,
  checkUserExistence,
  validateUpdateUserInput,
  usersController.updateUserProfile,
);

export default usersRoute;
