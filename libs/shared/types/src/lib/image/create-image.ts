import { object, optional, Output, string, ulid } from 'valibot';

export const CreateImageSchema = object({
  name: string(),
  description: optional(string()),
  parentId: optional(string([ulid()])),
});

export type CreateImage = Output<typeof CreateImageSchema>;
