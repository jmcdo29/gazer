import {
  number,
  object,
  optional,
  Output,
  string,
  regex,
  length,
} from 'valibot';
import { ulid } from '../validators';

export const ImageSchema = object({
  id: ulid(),
  url: string(),
  description: optional(string()),
  name: string(),
  index: number(),
});

export type Image = Output<typeof ImageSchema>;
