import { Generated } from 'kysely';

type GeneratedId<T> = Omit<T, 'id'> & { id: Generated<string> };

export interface Database {
  image: GeneratedId<{ name: string; description: string; location: string }>;
}
