import { Output, object, string, optional } from 'valibot';

export const CreateImageSchema = object({
  name: string(),
  description: optional(string()),
});

export type CreateImage = Output<typeof CreateImageSchema>;
