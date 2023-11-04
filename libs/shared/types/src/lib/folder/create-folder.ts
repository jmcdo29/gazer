import { object, optional, Output, string, ulid } from 'valibot';

export const CreateFolderSchema = object({
  name: string(),
  parentId: optional(string([ulid()])),
});

export type CreateFolder = Output<typeof CreateFolderSchema>;
