import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LabItem, LabItemDocument } from './schemas/lab-item.schema';
import { Model } from 'mongoose';
import { LabCategory, LabCategoryDocument } from 'src/lab-category/schemas/lab-category.schema';
import { CreateLabItemDto } from './dto/create-lab-item.dto';
import { UpdateLabItemDto } from './dto/update-lab-item.dto';

@Injectable()
export class LabItemService {
    constructor(
        @InjectModel(LabItem.name)
        private readonly labItemModel: Model<LabItemDocument>,

        @InjectModel(LabCategory.name)
        private readonly labCategoryModel: Model<LabCategoryDocument>
    ) {}



    //Create
    async create(createLabItemDto: CreateLabItemDto) {
        const category = await this.labCategoryModel.findById(createLabItemDto.category);

        if(!category) {
            throw new NotFoundException("Lab category no found");
        }

        const labItem = await this.labItemModel.create(createLabItemDto);

        return {
            message: "Lab item created successfully",
            labItem
        }
    }


    //Get all
    async findAll() {
        const labItems = await this.labItemModel
        .find()
        .populate("category", "name description")
        .sort({ createdAt: -1 })

        return {
            message: "Lab Items fetched successfully",
            labItems
        }
    }

    //Get One
    async findOne(id: string) {
        const labItem = await this.labItemModel.findById(id)
        .populate("category", "name description");

        if(!labItem) {
            throw new NotFoundException("Lab item not found")
        }

        return {
            message: "Lab item fetched successfully",
            labItem
        }
    }

    //Update
    async update(id: string, updateLabItemDto: UpdateLabItemDto) {
        const labItem = await this.labItemModel.findById(id);

        if(!labItem) {
            throw new NotFoundException("Lab item not found");
        }

        if(updateLabItemDto.category) {
            const category = await this.labCategoryModel.findById(updateLabItemDto.category);

            if(!category) {
                throw new NotFoundException("Lab category not found")
            }
        }

        const updateLabItem = await this.labItemModel.findByIdAndUpdate(id, updateLabItemDto, {
            new: true,
            runValidators: true
        })
        .populate("category", "name description");

        return {
            message: "Lab item updated successfully",
            labItem: updateLabItem
        }
    }

    //Delete
    async remove(id: string) {
        const labItem = await this.labItemModel.findById(id);

        if(!labItem) {
            throw new NotFoundException("Lab item not found")
        }

        await this.labItemModel.findByIdAndDelete(id);

        return {
            message: "Lab item deleted successfully"
        }
    }
}
