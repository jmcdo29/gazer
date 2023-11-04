import { TypeschemaDto } from '@nest-lab/typeschema';
import { object, optional, Output, string, transform, ulid } from 'valibot';

const ImagesQueryDtoSchema = object({
  page: transform(string(), (val) => Number.parseInt(val)),
  latestIndex: optional(transform(string(), (val) => Number.parseInt(val))),
  parentId: optional(string([ulid()])),
});

export class ImagesQueryDto extends TypeschemaDto(ImagesQueryDtoSchema) {}

export type ImagesQuery = Output<typeof ImagesQueryDtoSchema>;
