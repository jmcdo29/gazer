import { Database, InjectKysely } from '@gazer/server/kysely';
import { CreateImage, Image, UpdateImage } from '@gazer/shared/types';
import { File } from '@nest-lab/fastify-multer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { rm, writeFile } from 'fs/promises';
import { Kysely, sql } from 'kysely';

import { ImagesQuery } from './models/images-query.dto';

@Injectable()
export class ImageService {
  private readonly path = `${process.cwd()}/images`;

  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async getImages(
    options: ImagesQuery
  ): Promise<{ images: Image[]; count: string | number | bigint }> {
    const { page, latestIndex } = options;
    const images = await this.db
      .selectFrom('image')
      .selectAll()
      .where('index', '>=', latestIndex ?? (page - 1) * 20)
      .orderBy('index', 'asc')
      .limit(20)
      .execute();
    const count = await this.db
      .selectFrom('image')
      .select((eb) => eb.fn.count('id').as('total'))
      .executeTakeFirstOrThrow();
    return {
      images,
      count: count.total,
    };
  }

  async getImage(id: string): Promise<Image> {
    return this.db
      .selectFrom('image')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async addImage(newImage: CreateImage, file: File): Promise<Image> {
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
    if (updatedImage.index) {
      let operand = '+';
      const oldImageIndex = await this.db
        .selectFrom('image')
        .select('index')
        .where('id', '=', imageId)
        .executeTakeFirstOrThrow();
      let lowerIndex = updatedImage.index;
      let upperIndex = oldImageIndex.index;
      if (lowerIndex > upperIndex) {
        upperIndex += lowerIndex;
        lowerIndex = upperIndex - lowerIndex;
        upperIndex = upperIndex - lowerIndex;
        operand = '-';
      }
      await this.db
        .with('imagesToUpdateMinusOriginal', (db) =>
          db
            .selectFrom('image')
            .select(() => [
              sql<string>`id`.as('id'),
              sql<number>`index ${sql.raw(operand)} 1`.as('index'),
            ])
            .where('index', '>=', lowerIndex)
            .where('index', '<=', upperIndex)
            .where('id', '!=', imageId)
        )
        .with(
          'newImage',
          () =>
            sql`(SELECT ${updatedImage.index}::int as index, ${imageId}::ulid as id)`
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
          index: ub.ref('imagesToUpdate.index'),
        }))
        .whereRef('image.id', '=', 'imagesToUpdate.id')
        .execute();
    }
    const { index: _index, ...image } = updatedImage;
    if (image.name || image.description) {
      await this.db
        .updateTable('image')
        .set(image)
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
