import { Router } from 'express';

import { ROUTES } from '../constants';
import {
  AuthController,
  getAuthController,
} from '../controllers/auth.controller';
import { validateLoginInput, validateSignUpInput } from '../middlewares';

const authRoute = Router();

const authController: AuthController = getAuthController();

authRoute.post(ROUTES.AUTH.SIGN_UP, validateSignUpInput, authController.signup);
authRoute.post(ROUTES.AUTH.LOGIN, validateLoginInput, authController.login);

export default authRoute;
