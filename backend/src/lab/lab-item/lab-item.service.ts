import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import mongoose, {
  Model,
} from 'mongoose';



import { CreateLabItemDto } from './dto/create-lab-item.dto';
import { UpdateLabItemDto } from './dto/update-lab-item.dto';
import { LabItem, LabItemDocument } from '../schemas/lab-item.schema';
import { ImagekitService } from 'src/imageKit/imagekit.service';


@Injectable()
export class LabItemService {
  constructor(
    @InjectModel(LabItem.name)
    private readonly labItemModel:
      Model<LabItemDocument>,

    private readonly imagekitService:
      ImagekitService,
  ) {}

  // =========================
  // CREATE
  // =========================

  async create(
    createLabItemDto: CreateLabItemDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Lab item image is required',
      );
    }

    // Upload image to ImageKit
    const uploadedImage =
      await this.imagekitService.uploadFile(
        file,
        '/stem-innovation/lab-items',
      );

    // Create database record
    const labItem =
      await this.labItemModel.create({
        title:
          createLabItemDto.title,

        description:
          createLabItemDto.description,

        specification:
          createLabItemDto.specification,

        price:
          createLabItemDto.price,

        quantity:
          createLabItemDto.quantity ?? 0,

        // category:
        //   createLabItemDto.category,

        image:
          uploadedImage.url,

        imageFileId:
          uploadedImage.fileId,
      });

    return {
      success: true,
      message:
        'Lab item created successfully',

      labItem,
    };
  }

  // =========================
  // GET ALL
  // =========================

  async findAll() {
    const items =
      await this.labItemModel
        .find()
        .populate('category')
        .sort({
          createdAt: -1,
        });

    return {
      success: true,
      count: items.length,
      items,
    };
  }

  // =========================
  // GET ONE
  // =========================

  async findOne(id: string) {
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new BadRequestException(
        'Invalid lab item ID',
      );
    }

    const item =
      await this.labItemModel
        .findById(id)
        .populate('category');

    if (!item) {
      throw new NotFoundException(
        'Lab item not found',
      );
    }

    return {
      success: true,
      item,
    };
  }

  // =========================
  // UPDATE
  // =========================

  async update(
    id: string,
    updateLabItemDto: UpdateLabItemDto,
    file?: Express.Multer.File,
  ) {
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new BadRequestException(
        'Invalid lab item ID',
      );
    }

    const existingItem =
      await this.labItemModel.findById(id);

    if (!existingItem) {
      throw new NotFoundException(
        'Lab item not found',
      );
    }

    const updateData: any = {
      ...updateLabItemDto,
    };

    // New image
    if (file) {
      // Upload new image
      const uploadedImage =
        await this.imagekitService.uploadFile(
          file,
          '/stem-innovation/lab-items',
        );

      updateData.image =
        uploadedImage.url;

      updateData.imageFileId =
        uploadedImage.fileId;

      // Delete old image
      if (existingItem.imageFileId) {
        try {
          await this.imagekitService.deleteFile(
            existingItem.imageFileId,
          );
        } catch (error) {
          console.error(
            'Failed to delete old lab item image:',
            error,
          );
        }
      }
    }

    const updatedItem =
      await this.labItemModel
        .findByIdAndUpdate(
          id,
          updateData,
          {
            new: true,
            runValidators: true,
          },
        )
        .populate('category');

    return {
      success: true,
      message:
        'Lab item updated successfully',

      labItem: updatedItem,
    };
  }

  // =========================
  // DELETE
  // =========================

  async remove(id: string) {
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new BadRequestException(
        'Invalid lab item ID',
      );
    }

    const item =
      await this.labItemModel.findById(id);

    if (!item) {
      throw new NotFoundException(
        'Lab item not found',
      );
    }

    // Delete ImageKit image
    if (item.imageFileId) {
      try {
        await this.imagekitService.deleteFile(
          item.imageFileId,
        );
      } catch (error) {
        console.error(
          'Failed to delete lab item image:',
          error,
        );
      }
    }

    // Delete MongoDB record
    await this.labItemModel.findByIdAndDelete(
      id,
    );

    return {
      success: true,
      message:
        'Lab item deleted successfully',
    };
  }

  // =========================
  // GET BY CATEGORY
  // =========================

  async findByCategory(
    categoryId: string,
  ) {
    if (
      !mongoose.Types.ObjectId.isValid(
        categoryId,
      )
    ) {
      throw new BadRequestException(
        'Invalid category ID',
      );
    }

    const items =
      await this.labItemModel
        .find({
          category: categoryId,
        })
        .populate('category')
        .sort({
          createdAt: -1,
        });

    return {
      success: true,
      count: items.length,
      items,
    };
  }
}