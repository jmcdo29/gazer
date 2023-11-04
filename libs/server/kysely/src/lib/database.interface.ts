import { Folder, Image, Token, User } from '@gazer/shared/types';
import { Generated } from 'kysely';

type GeneratedId<T> = Omit<T, 'id'> & { id: Generated<string> };

export interface Database {
  image: Omit<GeneratedId<Image>, 'index' | 'stickyIndex'> & {
    index: Generated<number>;
    stickyIndex: number | null;
  };
  userAccount: GeneratedId<User>;
  token: Omit<Token, 'expiresAt'> & { expiresAt: Generated<string | Date> };
  folder: GeneratedId<Folder>;
}
