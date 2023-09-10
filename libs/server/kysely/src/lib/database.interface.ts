import { Image } from '@gazer/shared/types';
import { Generated } from 'kysely';

type GeneratedId<T> = Omit<T, 'id'> & { id: Generated<string> };

export interface Database {
  image: Omit<GeneratedId<Image>, 'index'> & { index: Generated<number> };
}
