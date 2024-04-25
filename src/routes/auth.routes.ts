import { Router } from 'express';

import { ROUTES } from '../constants';
import {
  AuthController,
  getAuthController,
} from '../controllers/auth.controller';
import {
  checkUserExistence,
  validateForgotPasswordInput,
  validateLoginInput,
  validateResetPasswordInput,
  validateSignUpInput,
  verifyToken,
} from '../middlewares';

const authRoute = Router();

const authController: AuthController = getAuthController();

authRoute.post(ROUTES.AUTH.SIGN_UP, validateSignUpInput, authController.signup);
authRoute.post(ROUTES.AUTH.LOGIN, validateLoginInput, authController.login);
authRoute.post(
  ROUTES.AUTH.FORGOT_PASSWORD,
  validateForgotPasswordInput,
  authController.forgotPassword,
);
authRoute.post(
  ROUTES.AUTH.RESET_PASSWORD,
  verifyToken,
  checkUserExistence,
  validateResetPasswordInput,
  authController.resetPassword,
);
export default authRoute;
