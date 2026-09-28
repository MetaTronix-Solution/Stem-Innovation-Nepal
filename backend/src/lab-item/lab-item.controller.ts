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

import { LabItemService } from './lab-item.service';

import { CreateLabItemDto } from './dto/create-lab-item.dto';
import { UpdateLabItemDto } from './dto/update-lab-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('lab-item')
export class LabItemController {
  constructor(
    private readonly labItemService: LabItemService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  create(
    @Body() createLabItemDto: CreateLabItemDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.labItemService.create(
      createLabItemDto,
      file,
    );
  }

  @Get()
  findAll() {
    return this.labItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labItemService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLabItemDto: UpdateLabItemDto,
  ) {
    return this.labItemService.update(
      id,
      updateLabItemDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labItemService.remove(id);
  }
}