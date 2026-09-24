import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LabCategory, LabCategoryDocument } from './schemas/lab-category.schema';
import { Model } from 'mongoose';
import { CreateLabCategoryDto } from './dto/create-lab-category.dto';

@Injectable()
export class LabCategoryService {
    constructor(
        @InjectModel(LabCategory.name)
        private readonly labCategoryModel: Model<LabCategoryDocument>,
    ) {}


    //Create
    async create(createLabCategoryDto: CreateLabCategoryDto) {
        const existingCategory = await this.labCategoryModel.findOne({name: createLabCategoryDto.name});

        if(existingCategory) {
            throw new ConflictException("Lab category with this name already exiasts.")
        }

        const category = await this.labCategoryModel.create(createLabCategoryDto);

        return {
            message: "Lab category created successfully",
            category
        }
    }


    //Get All

}
