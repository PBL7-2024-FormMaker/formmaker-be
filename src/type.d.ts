import { CustomJwtPayload } from './types/jwtPayload.types';

declare global {
  namespace Express {
    interface Request {
      session: CustomJwtPayload;
    }
  }
}
