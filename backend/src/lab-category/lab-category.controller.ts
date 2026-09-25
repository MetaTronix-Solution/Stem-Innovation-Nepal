import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LabCategoryService } from './lab-category.service';
import { CreateLabCategoryDto } from './dto/create-lab-category.dto';
import { UpdateLabCategoryDto } from './dto/update-lab-category.dto';

@Controller('lab-category')
export class LabCategoryController {
    constructor(
        private readonly labCategoryService: LabCategoryService
    ) {}

    @Post()
    create(
        @Body() createLabCategoryDto: CreateLabCategoryDto
    ) {
        return this.labCategoryService.create(createLabCategoryDto)
    }


    //Get
    @Get()
    findAll() {
        return this.labCategoryService.findAll();
    }

    //Get by id
    @Get(":id")
    findOne(
        @Param("id") id: string
    ) {
        return this.labCategoryService.findOne(id);
    }

    //Update
    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateLabCategoryDto: UpdateLabCategoryDto,
    ) {
        return this.labCategoryService.update(id, updateLabCategoryDto)
    }

    //Delete
    @Delete(":id")
    remove(
        @Param("id") id: string,
    ) {
        return this.labCategoryService.remove(id);
    }
}
