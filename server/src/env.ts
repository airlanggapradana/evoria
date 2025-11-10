import {z} from 'zod';

const envSchema = z.object({
  PORT: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production'])
})

export const env = envSchema.parse(process.env);