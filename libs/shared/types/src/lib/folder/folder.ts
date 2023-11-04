import { object, optional, Output, string, ulid } from 'valibot';

export const FolderSchema = object({
  id: string([ulid()]),
  name: string(),
  parentId: optional(string([ulid()])),
});

export type Folder = Output<typeof FolderSchema>;
