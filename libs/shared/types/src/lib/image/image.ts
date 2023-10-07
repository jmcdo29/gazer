import {
  boolean,
  nullable,
  number,
  object,
  optional,
  Output,
  string,
} from 'valibot';

import { ulid } from '../validators';

export const ImageSchema = object({
  id: ulid(),
  url: string(),
  description: optional(string()),
  name: string(),
  index: number(),
  stickyIndex: nullable(number()),
  sticky: boolean(),
});

export type Image = Output<typeof ImageSchema>;
