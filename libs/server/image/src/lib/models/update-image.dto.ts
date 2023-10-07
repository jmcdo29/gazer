import { UpdateImageSchema } from '@gazer/shared/types';
import { TypeschemaDto } from '@nest-lab/typeschema';

export class UpdateImageDto extends TypeschemaDto(UpdateImageSchema) {}
