import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { LabService } from './lab.service';

import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('lab')
export class LabController {
  constructor(
    private readonly labService: LabService,
  ) {}

  // CREATE
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  create(
    @Body() createLabDto: CreateLabDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.labService.create(
      createLabDto,
      file
    );
  }

  // GET ALL
  @Get()
  findAll() {
    return this.labService.findAll();
  }

  // GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  @UseInterceptors(FileInterceptor("image"))
  update(
    @Param('id') id: string,
    @Body() updateLabDto: UpdateLabDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.labService.update(
      id,
      updateLabDto,
      file
    );
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labService.remove(id);
  }
}