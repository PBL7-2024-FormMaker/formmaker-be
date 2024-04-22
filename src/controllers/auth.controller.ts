import { Response } from 'express';
import status from 'http-status';

import { CustomRequest } from '@/types/customRequest.types';

import { USER_ERROR_MESSAGES, USER_SUCCESS_MESSAGES } from '../constants';
import { LoginSchemaType, SignUpSchemaType } from '../schemas/users.schemas';
import { AuthService, getAuthService } from '../services/auth.service';
import {
  comparePassword,
  createJWT,
  errorResponse,
  successResponse,
} from '../utils';

let instance: AuthController | null = null;

export const getAuthController = () => {
  if (!instance) {
    instance = new AuthController();
  }
  return instance;
};

export class AuthController {
  private authService: AuthService;

  public constructor() {
    this.authService = getAuthService();
  }

  public signup = async (
    req: CustomRequest<SignUpSchemaType>,
    res: Response,
  ) => {
    try {
      const { email, password, username } = req.body;
      const isExistedUser = await this.authService.checkExist(email);

      if (isExistedUser)
        return errorResponse(
          res,
          USER_ERROR_MESSAGES.USER_ALREADY_EXISTS,
          status.BAD_REQUEST,
        );

      const newUser = await this.authService.createUser(
        email,
        password,
        username,
      );

      const payload = {
        userId: newUser.id,
        email: newUser.email,
      };
      const token = createJWT(payload);

      return successResponse(
        res,
        { token },
        USER_SUCCESS_MESSAGES.USER_CREATED,
        status.CREATED,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public login = async (req: CustomRequest<LoginSchemaType>, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.getUserByEmail(email);

      if (!user)
        return errorResponse(
          res,
          USER_ERROR_MESSAGES.USER_NOT_FOUND,
          status.NOT_FOUND,
        );

      if (!comparePassword(password, user.password))
        return errorResponse(
          res,
          USER_ERROR_MESSAGES.INCORRECT_INFORMATION,
          status.BAD_REQUEST,
        );

      const payload = {
        userId: user.id,
        email: user.email,
      };
      const token = createJWT(payload);

      return successResponse(
        res,
        { token },
        USER_SUCCESS_MESSAGES.LOGIN_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };
}
