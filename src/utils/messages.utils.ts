import { Response } from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = SUCCESS_MESSAGES.DEFAULT,
  status: number = OK,
) => res.status(status).json({ statusCode: status, message, data });

export const errorResponse = (
  res: Response,
  message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  status: number = INTERNAL_SERVER_ERROR,
) => res.status(status).json({ statusCode: status, message });
