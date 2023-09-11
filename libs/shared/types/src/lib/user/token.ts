import { date, enumType, object, Output, string, union } from 'valibot';

import { ulid } from '../validators';

export const TokenSchema = object({
  type: enumType(['session', 'refresh']),
  value: string(),
  userId: ulid(),
  expiresAt: union([date(), string()]),
});

export type Token = Output<typeof TokenSchema>;
