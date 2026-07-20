import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LabItem } from './schemas/lab-item.schema';
import { Model } from 'mongoose';
import { CreateLabItemDto } from './dto/create-lab-item.dto';

@Injectable()
export class LabItemService {
    constructor(
        @InjectModel(LabItem.name)
        private readonly labItemModel: Model<LabItem>,
    ) {}


    // create lab item
    async create(createLabItemDto: CreateLabItemDto, file: Express.Multer.File) {
  console.log(file);

  const labItem = await this.labItemModel.create({
    ...createLabItemDto,
    image: `/uploads/lab-item/${file.filename}`,
  });

  return {
    success: true,
    labItem,
  };
}

    // Get all lab items

    async findAll() {
        const items = await this.labItemModel.find().sort({ createdAt: -1 });

        return {
            success: true,
            count: items.length,
            items
        }
    }

    //Get single lab item

    async findOne(id: string) {
        const item = await this.labItemModel.findById(id);

        if(!item) {
            throw new NotFoundException("lAB ITEM NOT FOUND")
        }

        return {
            success: true,
            item
        }
    }


    //Update lab item

   async update(id: string, updateLabItemDto, UpdateLabItemDto) {
    const item = await this.labItemModel.findByIdAndUpdate(id, updateLabItemDto, {
        new: true,
        runValidators: true,
    });

    if(!item) {
        throw new NotFoundException("Lab item not found")
    }

    return {
        success: true,
        message: "Lab item updated successfully",
        item
    }
   }

   //Delete lab item

   async remove(id: string) {
    const item = await this.labItemModel.findByIdAndDelete(id);
    if(!item) {
        throw new NotFoundException("Lab item not found")
    }

    return {
        success: true,
        message: "Lab item deleted successfully"
    };

   }
    //Get items by category

    async findByCategory(category: string) {
        const items = await this.labItemModel.find({category});

        return {
            success: true,
            count: items.length,
            items
        }
    }

}
