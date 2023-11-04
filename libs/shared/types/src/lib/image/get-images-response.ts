import {
  array,
  boolean,
  literal,
  nullable,
  number,
  object,
  optional,
  Output,
  string,
  ulid,
  variant,
} from 'valibot';

const folder = object({
  id: string(),
  name: string(),
  parentId: optional(string()),
  type: literal('folder'),
});

const image = object({
  id: string([ulid()]),
  name: string(),
  description: optional(string()),
  index: number(),
  url: string(),
  sticky: boolean(),
  stickyIndex: nullable(number()),
  type: literal('image'),
});

export const GetImagesSchema = array(variant('type', [folder, image]));

export type GetImages = Output<typeof GetImagesSchema>;
