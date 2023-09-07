import { RawBuilder, sql } from 'kysely';

export const kyselyDefaultUlid = <T = unknown>(): RawBuilder<T> => {
  return sql`gen_ulid()`;
};

export const kyselyUlid = sql`ulid`;
