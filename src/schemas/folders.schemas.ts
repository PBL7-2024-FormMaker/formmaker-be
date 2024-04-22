import { z } from 'zod';

import { ERROR_MESSAGES } from '../constants';

export const CreateFolderSchema = z.object({
  name: z
    .string({
      required_error: ERROR_MESSAGES.REQUIRED_FIELD,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
    })
    .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
});

export const UpdateFolderSchema = z
  .object({
    name: z
      .string({
        invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: ERROR_MESSAGES.NO_EMPTY_REQUEST_BODY,
  });

export type CreateFolderSchemaType = z.infer<typeof CreateFolderSchema>;

export type UpdateFolderSchemaType = z.infer<typeof UpdateFolderSchema>;
