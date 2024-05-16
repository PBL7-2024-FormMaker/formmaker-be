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

export const checkRequiredEnvVars = (requiredEnvVars: string[]) => {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing ${envVar} in environment variables.`);
    }
  }
};
