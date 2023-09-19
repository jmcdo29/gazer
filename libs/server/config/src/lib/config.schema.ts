import {
  enumType,
  fallback,
  merge,
  number,
  object,
  string,
  transform,
} from 'valibot';

const hourInSeconds = 60 * 60;
const dayInSeconds = hourInSeconds * 24;

const dbConfig = object({
  DATABASE_USER: string(),
  DATABASE_PASSWORD: string(),
  DATABASE_PORT: transform(string(), (val) => Number.parseInt(val)),
  DATABASE_HOST: string(),
  DATABASE_NAME: string(),
});

const commonConfig = object({
  PORT: fallback(
    transform(string(), (val) => Number.parseInt(val, 10)),
    3333
  ),
  CORS: fallback(string(), 'http://localhost:4200'),
  NODE_ENV: enumType(['development', 'production', 'test']),
  SESSION_EXPIRES_IN: fallback(number(), hourInSeconds),
  REFRESH_EXPIRES_IN: fallback(number(), dayInSeconds),
});
export const Config = merge([commonConfig, dbConfig]);
