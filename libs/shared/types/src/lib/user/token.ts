import { date, object, Output, picklist, string, ulid, union } from 'valibot';

export const TokenSchema = object({
  type: picklist(['session', 'refresh']),
  value: string(),
  userId: string([ulid()]),
  expiresAt: union([date(), string()]),
});

export type Token = Output<typeof TokenSchema>;
