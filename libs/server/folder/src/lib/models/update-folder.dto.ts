import { UpdateFolderSchema } from '@gazer/shared/types';
import { TypeschemaDto } from '@nest-lab/typeschema';

export class UpdateFolderDto extends TypeschemaDto(UpdateFolderSchema) {}
