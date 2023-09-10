import { string, optional, number, object, Output } from 'valibot';

export const UpdateImageSchema = object({
  name: optional(string()),
  description: optional(string()),
  index: optional(number()),
});

export type UpdateImage = Output<typeof UpdateImageSchema>;
