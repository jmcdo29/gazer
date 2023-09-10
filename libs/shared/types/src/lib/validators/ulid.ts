import { length, regex, string } from 'valibot';

export const ulid = () =>
  string([length(26), regex(/[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}/i)]);
