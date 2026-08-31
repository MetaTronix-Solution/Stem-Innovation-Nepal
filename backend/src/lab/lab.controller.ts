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

import { LabService } from './lab.service';

import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';

@Controller('lab')
export class LabController {
  constructor(
    private readonly labService: LabService,
  ) {}

  // =========================
  // CREATE LAB
  // =========================

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  create(
    @Body() createLabDto: CreateLabDto,

    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.labService.create(
      createLabDto,
      file,
    );
  }

  // =========================
  // GET ALL LABS
  // =========================

  @Get()
  findAll() {
    return this.labService.findAll();
  }

  // =========================
  // GET SINGLE LAB
  // =========================

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.labService.findOne(id);
  }

  // =========================
  // UPDATE LAB
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
    updateLabDto: UpdateLabDto,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.labService.update(
      id,
      updateLabDto,
      file,
    );
  }

  // =========================
  // DELETE LAB
  // =========================

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.labService.remove(id);
  }
}