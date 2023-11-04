import { Database, InjectKysely } from '@gazer/server/kysely';
import {
  CreateImage,
  GetImages,
  Image,
  UpdateImage,
} from '@gazer/shared/types';
import { File } from '@nest-lab/fastify-multer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { rm, writeFile } from 'fs/promises';
import { Kysely, sql } from 'kysely';
import { UpdateObject } from 'kysely/dist/cjs/parser/update-set-parser';

import { ImagesQuery } from './models/images-query.dto';

@Injectable()
export class ImageService {
  private readonly path = `${process.cwd()}/images`;

  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async getImages(options: ImagesQuery): Promise<{
    images: GetImages;
    count: string | number | bigint;
  }> {
    const { page, latestIndex, parentId } = options;
    const folders = await this.db
      .selectFrom('folder')
      .selectAll()
      .where('parentId', parentId ? '=' : 'is', parentId ?? null)
      .orderBy('name asc')
      .limit(20)
      .offset((page - 1) * 20)
      .execute();
    const folderCount = await this.db
      .selectFrom('folder')
      .select((eb) => eb.fn.count<string>('id').as('total'))
      .where('parentId', parentId ? '=' : 'is', parentId ?? null)
      .executeTakeFirstOrThrow();
    const images = await this.db
      .selectFrom('image')
      .selectAll()
      .where(
        'index',
        '>=',
        latestIndex ??
          Math.max((page - 1) * 20 - Number.parseInt(folderCount.total), 0)
      )
      .where('folderId', parentId ? '=' : 'is', parentId ?? null)
      .orderBy(['sticky desc', 'stickyIndex asc', 'index asc'])
      .limit(Math.max(20 - folders.length, 0))
      .execute();
    const imageCount = await this.db
      .selectFrom('image')
      .select((eb) => eb.fn.count<string>('id').as('total'))
      .where('folderId', parentId ? '=' : 'is', parentId ?? null)
      .executeTakeFirstOrThrow();
    return {
      images: [
        ...folders.map((f) => ({ ...f, type: 'folder' as const })),
        ...images.map((i) => ({ ...i, type: 'image' as const })),
      ],
      count:
        Number.parseInt(folderCount.total, 0) +
        Number.parseInt(imageCount.total, 0),
    };
  }

  async getImage(id: string): Promise<{
    id: string;
    name: string;
    folderName: string | null;
    description: string | undefined;
    url: string;
  }> {
    return this.db
      .selectFrom('image as i')
      .leftJoin('folder as f', 'f.id', 'i.folderId')
      .select([
        'i.id',
        'i.name',
        'i.description',
        'i.url',
        'i.folderId',
        'f.name as folderName',
      ])
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async addImage(
    newImage: CreateImage,
    file: File
  ): Promise<Omit<Image, 'stickyIndex' | 'sticky'>> {
    let ext = '';
    switch (file.mimetype) {
      case 'image/jpeg':
        ext = 'jpg';
        break;
      case 'image/png':
        ext = 'png';
        break;
      case 'image/gif':
        ext = 'gif';
        break;
      case 'image/avif':
        ext = 'avif';
        break;
      case 'image/vnd.microsoft.icon':
        ext = 'ico';
        break;
      case 'image/svg+xml':
        ext = 'svg';
        break;
      case 'image/tiff':
        ext = 'tiff';
        break;
      case 'image/bmp':
        ext = 'bmp';
        break;
      default:
        ext = 'txt';
        break;
    }
    const url = `/${randomBytes(4).toString('hex')}-${randomBytes(4).toString(
      'hex'
    )}-${file.originalname}.${ext}`;
    if (!file.buffer) {
      throw new InternalServerErrorException(
        'How did you upload a file without a buffer?'
      );
    }
    await writeFile(`${this.path}${url}`, file.buffer);
    const image = await this.db
      .insertInto('image')
      .values({
        ...newImage,
        url,
        sticky: false,
      })
      .returning(['id', 'index'])
      .executeTakeFirstOrThrow();
    return {
      ...newImage,
      ...image,
      url,
    };
  }

  async updateImage(imageId: string, updatedImage: UpdateImage): Promise<void> {
    if (updatedImage.stickyIndex) {
      let operand = '+';
      const oldImageIndex = await this.db
        .selectFrom('image')
        .select('stickyIndex')
        .where('id', '=', imageId)
        .executeTakeFirstOrThrow();
      let lowerIndex = updatedImage.stickyIndex;
      let upperIndex = oldImageIndex.stickyIndex;
      if (upperIndex !== null) {
        if (lowerIndex > upperIndex) {
          upperIndex += lowerIndex;
          lowerIndex = upperIndex - lowerIndex;
          upperIndex = upperIndex - lowerIndex;
          operand = '-';
        }
      }
      await this.db
        .with('imagesToUpdateMinusOriginal', (db) =>
          db
            .selectFrom('image')
            .select(() => [
              sql<string>`id`.as('id'),
              sql<number>`${sql.ref('stickyIndex')} ${sql.raw(operand)} 1`.as(
                'index'
              ),
            ])
            .where('stickyIndex', '>=', lowerIndex)
            .where('stickyIndex', '<=', upperIndex ?? lowerIndex)
            .where('id', '!=', imageId)
        )
        .with(
          'newImage',
          () =>
            sql`(SELECT ${updatedImage.stickyIndex}::int as index, ${imageId}::ulid as id)`
        )
        .with('imagesToUpdate', (db) =>
          db
            .selectFrom('imagesToUpdateMinusOriginal')
            .select(['index', 'id'])
            .union(db.selectFrom('newImage').select(['index', 'id']))
        )
        .updateTable('image')
        .from('imagesToUpdate')
        .set((ub) => ({
          stickyIndex: ub.ref('imagesToUpdate.index'),
        }))
        .whereRef('image.id', '=', 'imagesToUpdate.id')
        .execute();
    }
    const { stickyIndex: index, ...image } = updatedImage;
    if (
      Object.keys(image).some((key) => image[key as keyof typeof image]) !==
      undefined
    ) {
      await this.db
        .updateTable('image')
        .set((eb) => {
          const update: UpdateObject<Database, 'image', 'image'> = { ...image };
          if (image.sticky === false) {
            update.stickyIndex = null;
          } else if (image.sticky && !index) {
            update.stickyIndex = eb.ref('index');
          }
          return update;
        })
        .where('id', '=', imageId)
        .execute();
    }
  }
  async removeImage(imageId: string): Promise<{ success: boolean }> {
    const image = await this.db
      .selectFrom('image')
      .select('url')
      .where('id', '=', imageId)
      .executeTakeFirstOrThrow();
    await rm(`${this.path}/${image.url}`);
    await this.db.deleteFrom('image').where('id', '=', imageId).execute();
    return { success: true };
  }
}
