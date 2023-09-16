import { TypeschemaDto } from '@nest-lab/typeschema';
import { object, Output, string, StringSchema, transform } from 'valibot';

const ImagesQueryDtoSchema = object({
  page: transform<StringSchema, number>(string(), (val) =>
    Number.parseInt(val)
  ),
});

export class ImagesQueryDto extends TypeschemaDto(ImagesQueryDtoSchema) {}

export type ImagesQuery = Output<typeof ImagesQueryDtoSchema>;
