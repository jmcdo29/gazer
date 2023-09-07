import { Kysely } from 'kysely';
import { kyselyUlid } from './lib';

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable('image')
    .addColumn('id', kyselyUlid, (col) => col.primaryKey())
    .addColumn('url', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('index', 'serial')
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable('image').execute();
};
