import { Kysely, sql } from 'kysely';

import { kyselyDefaultUlid, kyselyUlid } from './lib';

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable('folder')
    .addColumn('id', kyselyUlid, (col) =>
      col.primaryKey().defaultTo(kyselyDefaultUlid())
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('parentId', kyselyUlid, (col) =>
      col.references('folder.id').onDelete('cascade')
    )
    .execute();
  sql`ALTER TABLE ${sql.ref('folder')} ADD CONSTRAINT ${sql.raw(
    'folder_name_parent_id'
  )} UNIQUE NULLS NOT DISTINCT (${sql.raw(
    ['name', 'parent_id'].join(', ')
  )});`.execute(db);
  await db.schema
    .alterTable('image')
    .addColumn('folderId', kyselyUlid, (col) => col.references('folder.id'))
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable('image').dropColumn('folderId').execute();
  await db.schema.dropTable('folder').execute();
};
