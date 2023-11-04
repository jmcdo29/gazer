import { TypeschemaDto } from '@nest-lab/typeschema';
import { object, string, ulid } from 'valibot';

const IdParamSchema = object({
  id: string([ulid()]),
});

export class IdParamDto extends TypeschemaDto(IdParamSchema) {}
