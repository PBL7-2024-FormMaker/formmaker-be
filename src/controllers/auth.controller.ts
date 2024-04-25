import { Response } from 'express';
import status from 'http-status';

import { CustomRequest } from '@/types/customRequest.types';

import { USER_ERROR_MESSAGES, USER_SUCCESS_MESSAGES } from '../constants';
import { Mailer } from '../infracstructure/mailer/mailer';
import {
  ForgotPasswordType,
  LoginSchemaType,
  ResetPasswordType,
  SignUpSchemaType,
} from '../schemas/users.schemas';
import { AuthService, getAuthService } from '../services/auth.service';
import { getUsersService, UsersService } from '../services/users.service';
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
  private userService: UsersService;

  public constructor() {
    this.authService = getAuthService();
    this.userService = getUsersService();
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

  public forgotPassword = async (
    req: CustomRequest<ForgotPasswordType>,
    res: Response,
  ) => {
    try {
      //1.Get user
      const { email } = req.body;
      const user = await this.authService.getUserByEmail(email);

      if (!user)
        return errorResponse(
          res,
          USER_ERROR_MESSAGES.USER_NOT_FOUND,
          status.NOT_FOUND,
        );

      //2. Generate a random reset token
      const payload = {
        userId: user.id,
        email: user.email,
      };
      const resetoken = createJWT(payload);
      //3. Send to token back to the user email
      const resetUrl = `${process.env.CALLBACK_URL}?token=${resetoken}`;
      const message = `Click this link to reset your password ${resetUrl}`;
      try {
        const mailer = new Mailer();
        await mailer.sendPasswordResetEmail({
          email: user.email,
          subject: 'Reset password',
          message,
        });
        return successResponse(
          res,
          { resetoken },
          USER_SUCCESS_MESSAGES.SENT_EMAIL_SUCCESS,
        );
      } catch (error) {
        return errorResponse(res, USER_ERROR_MESSAGES.ERROR_SEND_EMAIL, 500);
      }
    } catch (error) {
      return errorResponse(res);
    }
  };

  public resetPassword = async (
    req: CustomRequest<ResetPasswordType>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;
      const { password } = req.body;
      const newPassword = await this.userService.resetPassword(
        userId,
        password,
      );
      return successResponse(
        res,
        { data: newPassword },
        USER_SUCCESS_MESSAGES.RESET_PASSWORD_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };
}
