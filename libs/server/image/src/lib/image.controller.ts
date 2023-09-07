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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ImageService } from './image.service';
import { CreateImageDto } from './models/create-image.dto';
import { ImageIdParamDto } from './models/image-id.dto';
import { UpdateImageDto } from './models/update-image.dto';

@Controller('image')
export class ImageController {
  constructor(private readonly service: ImageService) {}

  @Get()
  async getImages(): Promise<Image[]> {
    return this.service.getImages();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async addImage(
    @Body() body: CreateImageDto,
    @UploadedFile() file: File
  ): Promise<Image> {
    return this.service.addImage(body.data, file);
  }

  @Patch(':id')
  async updateImage(
    @Param() param: ImageIdParamDto,
    @Body() body: UpdateImageDto
  ) {
    return this.service.updateImage(param.data.id, body.data);
  }

  @Delete(':id')
  async removeImage(@Param() param: ImageIdParamDto) {
    return this.service.removeImage(param.data.id);
  }
}
