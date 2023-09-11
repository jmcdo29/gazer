import { Kysely, sql } from 'kysely';

import { kyselyDefaultUlid, kyselyUlid } from './lib';

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable('user_account')
    .addColumn('id', kyselyUlid, (col) =>
      col.defaultTo(kyselyDefaultUlid()).primaryKey()
    )
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text', (col) => col.notNull())
    .execute();
  await db.schema
    .createTable('token')
    .addColumn('type', 'text', (col) => col.defaultTo('session').notNull())
    .addColumn('value', 'text', (col) => col.primaryKey())
    .addColumn('expires_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW() + '1 hour'`)
    )
    .addColumn('user_id', kyselyUlid, (col) =>
      col.references('user_account.id').onDelete('cascade')
    )
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable('token').execute();
  await db.schema.dropTable('user_account').execute();
};
