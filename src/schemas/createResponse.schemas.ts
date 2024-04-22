import { z } from 'zod';

export const fieldResponseSchema = z.object({
  fieldId: z.string(),
  text: z.string(),
});

export const elementResponseSchema = z.object({
  elementId: z.string(),
  answers: z.array(fieldResponseSchema),
});

export const createdResponseValidation = z.object({
  formAnswers: z.array(elementResponseSchema),
});

export type FieldResponseSchema = z.infer<typeof fieldResponseSchema>;

export type ElementResponseSchema = z.infer<typeof elementResponseSchema>;

export type CreatedResponseSchema = z.infer<typeof createdResponseValidation>;
