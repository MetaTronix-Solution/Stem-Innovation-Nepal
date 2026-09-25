import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { LabItemService } from './lab-item.service';

import { CreateLabItemDto } from './dto/create-lab-item.dto';
import { UpdateLabItemDto } from './dto/update-lab-item.dto';

@Controller('lab-item')
export class LabItemController {
  constructor(
    private readonly labItemService: LabItemService,
  ) {}

  @Post()
  create(
    @Body() createLabItemDto: CreateLabItemDto,
  ) {
    return this.labItemService.create(
      createLabItemDto,
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