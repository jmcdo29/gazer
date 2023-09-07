import { KyselyModule } from '@gazer/server/kysely';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { Module } from '@nestjs/common';

import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [KyselyModule, FastifyMulterModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [],
})
export class ImageModule {}
