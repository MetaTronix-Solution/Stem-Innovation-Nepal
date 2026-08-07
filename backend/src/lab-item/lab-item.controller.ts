import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LabItemService } from './lab-item.service';
import { CreateLabItemDto } from './dto/create-lab-item.dto';
import { UpdateLabItemDto } from './dto/update-lab-item.dto';
import { memoryStorage } from 'multer';

@Controller('lab-item')
export class LabItemController {
  constructor(private readonly labItemService: LabItemService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  create(
    @Body() createLabItemDto: CreateLabItemDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.labItemService.create(createLabItemDto, file);
  }

  @Get()
  findAll() {
    return this.labItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labItemService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateLabItemDto: UpdateLabItemDto,
  ) {
    return this.labItemService.update(id, updateLabItemDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labItemService.remove(id);
  }
}
