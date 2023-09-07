import { z } from 'zod';

const hourInSeconds = 60 * 60;
const dayInSeconds = hourInSeconds * 24;

const prodConfig = z.object({
  NODE_ENV: z.literal('production'),
});

const devConfig = z.object({
  NODE_ENV: z.enum(['development', 'test']),
});

const dbConfig = z.object({
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_PORT: z.string().transform((val) => Number.parseInt(val)),
  DATABASE_HOST: z.string(),
  DATABASE_NAME: z.string(),
});

const commonConfig = z.object({
  PORT: z
    .optional(z.string().transform((val) => Number.parseInt(val, 10)))
    .default('3333'),
  CORS: z.optional(z.string()).default('http://localhost:4200'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  SESSION_EXPIRES_IN: z.number().optional().default(hourInSeconds),
  REFRESH_EXPIRES_IN: z
    .number()
    .optional()
    .default(7 * dayInSeconds),
});
export const Config = z.intersection(
  commonConfig.merge(dbConfig),
  z.discriminatedUnion('NODE_ENV', [prodConfig, devConfig])
);
