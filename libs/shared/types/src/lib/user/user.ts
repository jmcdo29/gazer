import { email, object, Output, string, ulid } from 'valibot';

export const UserSchema = object({
  id: string([ulid()]),
  email: string([email()]),
  password: string(),
});

export type User = Output<typeof UserSchema>;
