import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto, UpdateFolderDto } from './models';
import { IdParamDto } from './models/id-param.dto';
import { LoggedInGuard } from '@gazer/server/security';

@Controller('folder')
export class FolderController {
  constructor(private readonly service: FolderService) {}

  @Get()
  async getAll() {
    return await this.service.getAll();
  }

  @Get(':id')
  async getOne(@Param() param: IdParamDto) {
    return this.service.getOne(param.data.id);
  }

  @UseGuards(LoggedInGuard)
  @Post()
  async create(@Body() body: CreateFolderDto) {
    return await this.service.create(body.data);
  }

  @UseGuards(LoggedInGuard)
  @Patch(':id')
  async update(@Param() param: IdParamDto, @Body() body: UpdateFolderDto) {
    return await this.service.update(param.data.id, body.data);
  }
}
