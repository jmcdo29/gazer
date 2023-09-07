import { ulid } from '@gazer/shared/types';
import { TypeschemaDto } from '@nest-lab/typeschema';
import { object } from 'valibot';

const ImageIdParamSchema = object({
  id: ulid(),
});

export class ImageIdParamDto extends TypeschemaDto(ImageIdParamSchema) {}
