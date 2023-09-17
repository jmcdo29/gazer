import { LoggedInGuard } from '@gazer/server/security';
import { Image } from '@gazer/shared/types';
import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ImageService } from './image.service';
import { CreateImageDto } from './models/create-image.dto';
import { ImageIdParamDto } from './models/image-id.dto';
import { ImagesQueryDto } from './models/images-query.dto';
import { UpdateImageDto } from './models/update-image.dto';

@Controller('image')
export class ImageController {
  constructor(private readonly service: ImageService) {}

  @Get()
  async getImages(
    @Query() query: ImagesQueryDto
  ): Promise<{ images: Image[]; count: string | number | bigint }> {
    return this.service.getImages(query.data);
  }

  @UseGuards(LoggedInGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async addImage(
    @Body() body: CreateImageDto,
    @UploadedFile() file: File
  ): Promise<Image> {
    return this.service.addImage(body.data, file);
  }

  @UseGuards(LoggedInGuard)
  @Patch(':id')
  async updateImage(
    @Param() param: ImageIdParamDto,
    @Body() body: UpdateImageDto
  ) {
    return this.service.updateImage(param.data.id, body.data);
  }

  @UseGuards(LoggedInGuard)
  @Delete(':id')
  async removeImage(@Param() param: ImageIdParamDto) {
    return this.service.removeImage(param.data.id);
  }
}
