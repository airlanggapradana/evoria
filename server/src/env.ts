import {z} from 'zod';

const envSchema = z.object({
  PORT: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production']),
  MIDTRANS_SERVER_KEY: z.string(),
  MIDTRANS_CLIENT_KEY: z.string(),
  IS_PRODUCTION: z.string(),
})

export const env = envSchema.parse(process.env);