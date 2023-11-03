import { TypeschemaDto } from '@nest-lab/typeschema';
import { object, string, ulid } from 'valibot';

const ImageIdParamSchema = object({
  id: string([ulid()]),
});

export class ImageIdParamDto extends TypeschemaDto(ImageIdParamSchema) {}
