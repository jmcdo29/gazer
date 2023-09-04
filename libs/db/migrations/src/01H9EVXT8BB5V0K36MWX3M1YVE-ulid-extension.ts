import { Kysely, sql } from 'kysely';

export const up = async (db: Kysely<unknown>) => {
  await sql`CREATE EXTENSION ulid;`.execute(db);
}

export const down = async (db: Kysely<unknown>) => {
  await sql`DROP EXTENSION ulid;`.execute(db);
}
