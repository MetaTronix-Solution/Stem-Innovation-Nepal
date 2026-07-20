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
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('lab-item')
export class LabItemController {
    constructor(private readonly labItemService: LabItemService) {}


    // Create Lab Item
    @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/lab-item',
        filename: (req, file, cb) => {
          const unique =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() createLabItemDto: CreateLabItemDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.labItemService.create(createLabItemDto, file);
  }



    // Get All
    @Get()
    findAll() {
        return this.labItemService.findAll();
    }

    //Get one
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.labItemService.findOne(id);
    }

    // Update
    @Put(":id")
    @UseInterceptors(FileInterceptor("image"))
    update(
        @Param("id") id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateLabItemDto: UpdateLabItemDto,
    ) {
        return this.labItemService.update(id, updateLabItemDto, file);
    }

    // Update

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.labItemService.remove(id);
    }


}
