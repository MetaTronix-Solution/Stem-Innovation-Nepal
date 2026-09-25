import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LabCategory, LabCategoryDocument } from './schemas/lab-category.schema';
import { Model } from 'mongoose';
import { CreateLabCategoryDto } from './dto/create-lab-category.dto';
import { UpdateLabCategoryDto } from './dto/update-lab-category.dto';

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
    async findAll() {
        const categories = await this.labCategoryModel.find().sort({ createdAt: -1 });

        return {
            message: "Lab categories fetched successfully",
            categories
        };
    }

    //Get One
    async findOne(id: string) {
        const category = await this.labCategoryModel.findById(id);

        if(!category) {
            throw new NotFoundException("Lab category not found")
        }

        return {
            message: "Lab category fetched successfully",
            category
        }
    }

    //Update
    async update(id: string, updateLabCategoryDto: UpdateLabCategoryDto) {
        const category = await this.labCategoryModel.findById(id);

        if(!category) {
            throw new NotFoundException("Lab category not found")
        }

        if(updateLabCategoryDto.name) {
            const existingCategory = await this.labCategoryModel.findOne({name: updateLabCategoryDto.name, _id: {$ne: id}});

            if(existingCategory) {
                throw new NotFoundException("Lab category with this name is already exists");
            }
        }

        const updateCategory = await this.labCategoryModel.findByIdAndUpdate(
            id,
            updateLabCategoryDto,
            {
                new: true,
                runValidators: true
            }
        );

        return {
            message: "Lab Category updated successfully",
            category: updateCategory
        }

    }

    //Delete Category
    async remove(id: string) {
        const category = await this.labCategoryModel.findById(id);

        if(!category) {
            throw new NotFoundException("Lab category not found")
        }

        await this.labCategoryModel.findByIdAndDelete(id);

        return {
            message: "Lab category deleted successfully"
        }
    }

}
