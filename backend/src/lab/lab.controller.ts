import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { LabService } from './lab.service';

import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';

@Controller('lab')
export class LabController {
  constructor(
    private readonly labService: LabService,
  ) {}

  // CREATE
  @Post()
  create(
    @Body() createLabDto: CreateLabDto,
  ) {
    return this.labService.create(
      createLabDto,
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
  update(
    @Param('id') id: string,
    @Body() updateLabDto: UpdateLabDto,
  ) {
    return this.labService.update(
      id,
      updateLabDto,
    );
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labService.remove(id);
  }
}