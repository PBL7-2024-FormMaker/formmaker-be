import { z } from 'zod';

export const validateData = async (
  schema: z.AnyZodObject | z.ZodEffects<z.AnyZodObject>,
  data: unknown,
) => {
  try {
    await schema.parseAsync(data);
  } catch (error) {
    let err = error;
    if (err instanceof z.ZodError) {
      err = err.issues.map((e) => ({ path: e.path, message: e.message }));
    }
    return { error: err };
  }
};
