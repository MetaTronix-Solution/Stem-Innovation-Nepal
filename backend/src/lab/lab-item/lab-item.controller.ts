import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { memoryStorage } from 'multer';

import { LabItemService } from './lab-item.service';

import { CreateLabItemDto } from './dto/create-lab-item.dto';
import { UpdateLabItemDto } from './dto/update-lab-item.dto';

@Controller('lab-item')
export class LabItemController {
  constructor(
    private readonly labItemService: LabItemService,
  ) {}

  // =========================
  // CREATE LAB ITEM
  // =========================

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  create(
    @Body()
    createLabItemDto: CreateLabItemDto,

    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.labItemService.create(
      createLabItemDto,
      file,
    );
  }

  // =========================
  // GET ALL
  // =========================

  @Get()
  findAll() {
    return this.labItemService.findAll();
  }

  // =========================
  // GET BY CATEGORY
  // =========================

  @Get('category/:categoryId')
  findByCategory(
    @Param('categoryId')
    categoryId: string,
  ) {
    return this.labItemService.findByCategory(
      categoryId,
    );
  }

  // =========================
  // GET ONE
  // =========================

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.labItemService.findOne(id);
  }

  // =========================
  // UPDATE
  // =========================

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  update(
    @Param('id') id: string,

    @Body()
    updateLabItemDto: UpdateLabItemDto,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.labItemService.update(
      id,
      updateLabItemDto,
      file,
    );
  }

  // =========================
  // DELETE
  // =========================

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.labItemService.remove(id);
  }
}