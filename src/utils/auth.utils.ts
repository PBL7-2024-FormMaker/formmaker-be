import { compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { JWT_SECRET, JWT_TOKEN_DURATION } from '../configs/secrets';
import { CustomJwtPayload } from '../types/jwtPayload.types';

export const comparePassword = (reqPassword: string, userPassword: string) =>
  compareSync(reqPassword, userPassword);

export const createJWT = (payload: CustomJwtPayload): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_TOKEN_DURATION });
