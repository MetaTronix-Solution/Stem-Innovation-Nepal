import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LabService } from './lab.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';






@Controller('lab')
export class LabController {
    constructor(private readonly labService: LabService) {}


    //Create Lab Setup

    @Post()
    @UseInterceptors(
        FileInterceptor("image",
             {storage: diskStorage({
                destination: "./uploads/lab",
                filename: (req, file, cb) => {
                    const uniqueName =
                    Date.now() +
                    "-" +
                    Math.round(Math.random() * 1e9) +
                    extname(file.originalname);

                    cb(null, uniqueName);
                },
            }),
        }),
    )

    create(
        @Body() createLabDto: CreateLabDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.labService.create(createLabDto, file)
    }



    //Get All Lab Setups

    @Get()
    findAll() {
        return this.labService.findAll();
    }


    //Get Single Lab Setup

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.labService.findOne(id);
    }


    // Update Lab Setup

    @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/lab',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);

          cb(null, uniqueName);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateLabDto: UpdateLabDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.labService.update(id, updateLabDto, file);
  }



  //Delete Lab Setup

  @Delete("id")
  remove(@Param("id") id: string) {
    return this.labService.remove(id);
  }


}
