import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LabItem } from './schemas/lab-item.schema';
import { Model } from 'mongoose';
import { CreateLabItemDto } from './dto/create-lab-item.dto';
import { UpdateLabItemDto } from './dto/update-lab-item.dto';
import { ImagekitService } from '../imageKit/imagekit.service';

@Injectable()
export class LabItemService {
  constructor(
    @InjectModel(LabItem.name)
    private readonly labItemModel: Model<LabItem>,
    private readonly imagekitService: ImagekitService,
  ) {}

  // Create lab item
  async create(createLabItemDto: CreateLabItemDto, file: Express.Multer.File) {
    let imageUrl: string | undefined;
    let imageFileId: string | undefined;

    if (file) {
      const uploaded = await this.imagekitService.uploadFile(file, 'lab-item');
      imageUrl = uploaded.url;
      imageFileId = uploaded.fileId;
    }

    const labItem = await this.labItemModel.create({
      ...createLabItemDto,
      image: imageUrl,
      imageFileId,
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
      items,
    };
  }

  // Get single lab item
  async findOne(id: string) {
    const item = await this.labItemModel.findById(id);
    if (!item) {
      throw new NotFoundException('Lab item not found');
    }
    return {
      success: true,
      item,
    };
  }

  // Update lab item
  async update(
    id: string,
    updateLabItemDto: UpdateLabItemDto,
    file?: Express.Multer.File,
  ) {
    const existing = await this.labItemModel.findById(id);
    if (!existing) {
      throw new NotFoundException('Lab item not found');
    }

    const updateData: any = { ...updateLabItemDto };

    if (file) {
      const uploaded = await this.imagekitService.uploadFile(file, 'lab-item');
      updateData.image = uploaded.url;
      updateData.imageFileId = uploaded.fileId;

      // Clean up the old image so you don't accumulate orphaned files in ImageKit
      if (existing.imageFileId) {
        await this.imagekitService.deleteFile(existing.imageFileId);
      }
    }

    const item = await this.labItemModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return {
      success: true,
      message: 'Lab item updated successfully',
      item,
    };
  }

  // Delete lab item
  async remove(id: string) {
    const item = await this.labItemModel.findByIdAndDelete(id);
    if (!item) {
      throw new NotFoundException('Lab item not found');
    }

    if (item.imageFileId) {
      await this.imagekitService.deleteFile(item.imageFileId);
    }

    return {
      success: true,
      message: 'Lab item deleted successfully',
    };
  }

  // Get items by category
  async findByCategory(category: string) {
    const items = await this.labItemModel.find({ category });
    return {
      success: true,
      count: items.length,
      items,
    };
  }
}