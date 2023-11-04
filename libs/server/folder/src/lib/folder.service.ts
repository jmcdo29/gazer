import { Database, InjectKysely } from '@gazer/server/kysely';
import { CreateFolder, Folder, UpdateFolder } from '@gazer/shared/types';
import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';

@Injectable()
export class FolderService {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async getAll(): Promise<Folder[]> {
    return await this.db.selectFrom('folder').selectAll().execute();
  }

  async getOne(id: string): Promise<Folder> {
    return await this.db
      .selectFrom('folder')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async create(folder: CreateFolder): Promise<Folder> {
    return await this.db
      .insertInto('folder')
      .values(folder)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async update(
    id: string,
    folder: UpdateFolder
  ): Promise<{ success: boolean }> {
    await this.db
      .updateTable('folder')
      .set(folder)
      .where('id', '=', id)
      .execute();
    return { success: true };
  }
}
