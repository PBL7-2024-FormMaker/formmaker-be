import { z } from 'zod';

import { ERROR_MESSAGES, USER_ERROR_MESSAGES } from '../constants';

export const CreateTeamSchema = z.object({
  name: z
    .string({
      required_error: ERROR_MESSAGES.REQUIRED_FIELD,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
    })
    .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  logoUrl: z
    .string({
      invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
    })
    .optional(),
});

export const UpdateTeamSchema = z
  .object({
    name: z
      .string({
        required_error: ERROR_MESSAGES.REQUIRED_FIELD,
        invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    logoUrl: z.string({
      invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
    }),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: ERROR_MESSAGES.NO_EMPTY_REQUEST_BODY,
  });

export const AddTeamMemberSchema = z.object({
  email: z
    .string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
    .trim()
    .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD)
    .email(USER_ERROR_MESSAGES.INVALID_EMAIL),
});

export const RemoveTeamMemberSchema = z.object({
  memberIds: z
    .number({
      required_error: ERROR_MESSAGES.REQUIRED_FIELD,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_ARRAY_TYPE,
    })
    .array()
    .nonempty({ message: ERROR_MESSAGES.NO_EMPTY_FIELD }),
});

export type CreateTeamSchemaType = z.infer<typeof CreateTeamSchema>;

export type UpdateTeamSchemaType = z.infer<typeof UpdateTeamSchema>;

export type AddTeamMemberSchemaType = z.infer<typeof AddTeamMemberSchema>;

export type RemoveTeamMemberSchemaType = z.infer<typeof RemoveTeamMemberSchema>;
