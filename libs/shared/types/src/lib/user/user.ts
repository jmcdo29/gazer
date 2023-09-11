import { email, object, Output, string } from 'valibot';

import { ulid } from '../validators';

export const UserSchema = object({
  id: ulid(),
  email: string([email()]),
  password: string(),
});

export type User = Output<typeof UserSchema>;
