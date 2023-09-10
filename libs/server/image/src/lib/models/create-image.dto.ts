import { TypeschemaDto } from '@nest-lab/typeschema';
import { CreateImageSchema } from '@gazer/shared/types';

export class CreateImageDto extends TypeschemaDto(CreateImageSchema) {}
