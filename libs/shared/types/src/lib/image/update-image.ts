import {
  boolean,
  number,
  object,
  optional,
  Output,
  string,
  ulid,
} from 'valibot';

export const UpdateImageSchema = object({
  name: optional(string()),
  description: optional(string()),
  stickyIndex: optional(number()),
  sticky: optional(boolean()),
  parentId: optional(string([ulid()])),
});

export type UpdateImage = Output<typeof UpdateImageSchema>;
