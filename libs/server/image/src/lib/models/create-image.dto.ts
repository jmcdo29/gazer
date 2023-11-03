import { CreateImageSchema } from '@gazer/shared/types';
import { TypeschemaDto } from '@nest-lab/typeschema';

export class CreateImageDto extends TypeschemaDto(CreateImageSchema) {}
