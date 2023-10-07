import { boolean, number, object, optional, Output, string } from 'valibot';

export const UpdateImageSchema = object({
  name: optional(string()),
  description: optional(string()),
  stickyIndex: optional(number()),
  sticky: optional(boolean()),
});

export type UpdateImage = Output<typeof UpdateImageSchema>;
