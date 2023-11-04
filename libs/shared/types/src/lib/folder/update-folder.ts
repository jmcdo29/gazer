import { object, optional, Output, string, ulid } from 'valibot';

export const UpdateFolderSchema = object({
  name: optional(string()),
  parentId: optional(string([ulid()])),
});

export type UpdateFolder = Output<typeof UpdateFolderSchema>;
