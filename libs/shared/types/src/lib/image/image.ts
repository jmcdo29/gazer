import {
  boolean,
  nullable,
  number,
  object,
  optional,
  Output,
  string,
  ulid,
} from 'valibot';

export const ImageSchema = object({
  id: string([ulid()]),
  url: string(),
  description: optional(string()),
  name: string(),
  index: number(),
  stickyIndex: nullable(number()),
  sticky: boolean(),
  folderId: optional(string([ulid()])),
});

export type Image = Output<typeof ImageSchema>;
