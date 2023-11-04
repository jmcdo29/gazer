import { CreateFolderSchema } from '@gazer/shared/types';
import { TypeschemaDto } from '@nest-lab/typeschema';

export class CreateFolderDto extends TypeschemaDto(CreateFolderSchema) {}
