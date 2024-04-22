import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { z } from 'zod';

import { errorResponse } from '../utils';

export const validate =
  (schema: z.AnyZodObject | z.ZodEffects<z.AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      const err = error;
      const errorMessages: Record<string, string[]> = {};
      let returnMessage: string = '';
      if (err instanceof z.ZodError) {
        err.issues.forEach((e) => {
          const field = e.path[e.path.length - 1];
          const message = e.message;

          if (errorMessages[field]) {
            errorMessages[field].push(message);
          } else {
            errorMessages[field] = [message];
          }
        });

        returnMessage = Object.entries(errorMessages)
          .map(
            ([field, messages]) => `Field '${field}': ${messages.join(', ')}`,
          )
          .join('; ');
      }
      return errorResponse(res, returnMessage, status.BAD_REQUEST);
    }
  };
