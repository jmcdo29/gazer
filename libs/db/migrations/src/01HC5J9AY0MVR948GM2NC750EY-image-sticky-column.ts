import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>) => {
  await db.schema
    .alterTable('image')
    .addColumn('sticky', 'boolean', (col) => col.defaultTo(false))
    .addColumn('stickyIndex', 'integer', (col) => col.defaultTo(null))
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema
    .alterTable('image')
    .dropColumn('stickyIndex')
    .dropColumn('sticky')
    .execute();
};
