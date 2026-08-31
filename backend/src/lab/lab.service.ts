import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import mongoose, {
  Model,
} from 'mongoose';

import {
  Lab,
  LabDocument,
} from './schemas/lab.schema';



import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';
import { LabItem } from './schemas/lab-item.schema';
import { ImagekitService } from 'src/imageKit/imagekit.service';



@Injectable()
export class LabService {
  constructor(
    @InjectModel(Lab.name)
    private readonly labModel:
      Model<LabDocument>,

    @InjectModel(LabItem.name)
    private readonly labItemModel:
      Model<LabItem>,

    private readonly imagekitService:
      ImagekitService,
  ) {}

  // =========================
  // CREATE LAB
  // =========================

  async create(
    createLabDto: CreateLabDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Lab image is required',
      );
    }

    // Validate lab items
    if (
      createLabDto.labItems &&
      createLabDto.labItems.length > 0
    ) {
      const labItems =
        await this.labItemModel.find({
          _id: {
            $in: createLabDto.labItems,
          },
        });

      if (
        labItems.length !==
        createLabDto.labItems.length
      ) {
        throw new BadRequestException(
          'One or more lab items do not exist',
        );
      }
    }

    // Upload image to ImageKit
    const uploadedImage =
      await this.imagekitService.uploadFile(
        file,
        '/stem-innovation/labs',
      );

    // Create lab
    const lab =
      await this.labModel.create({
        title: createLabDto.title,

        description:
          createLabDto.description,

        price:
          createLabDto.price,

        labItems:
          createLabDto.labItems || [],

        image:
          uploadedImage.url,

        imageFileId:
          uploadedImage.fileId,
      });

    return {
      success: true,
      message:
        'Lab setup created successfully',

      lab,
    };
  }

  // =========================
  // GET ALL LABS
  // =========================

  async findAll() {
    const labs =
      await this.labModel
        .find()
        .populate('labItems')
        .sort({
          createdAt: -1,
        });

    return {
      success: true,
      count: labs.length,
      labs,
    };
  }

  // =========================
  // GET SINGLE LAB
  // =========================

  async findOne(id: string) {
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new BadRequestException(
        'Invalid lab ID',
      );
    }

    const lab =
      await this.labModel
        .findById(id)
        .populate('labItems');

    if (!lab) {
      throw new NotFoundException(
        'Lab setup not found',
      );
    }

    return {
      success: true,
      lab,
    };
  }

  // =========================
  // UPDATE LAB
  // =========================

  async update(
    id: string,
    updateLabDto: UpdateLabDto,
    file?: Express.Multer.File,
  ) {
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new BadRequestException(
        'Invalid lab ID',
      );
    }

    const existingLab =
      await this.labModel.findById(id);

    if (!existingLab) {
      throw new NotFoundException(
        'Lab setup not found',
      );
    }

    // Validate lab items
    if (
      updateLabDto.labItems &&
      updateLabDto.labItems.length > 0
    ) {
      const labItems =
        await this.labItemModel.find({
          _id: {
            $in: updateLabDto.labItems,
          },
        });

      if (
        labItems.length !==
        updateLabDto.labItems.length
      ) {
        throw new BadRequestException(
          'One or more lab items do not exist',
        );
      }
    }

    const updateData: any = {
      ...updateLabDto,
    };

    // If new image is uploaded
    if (file) {
      // Upload new image first
      const uploadedImage =
        await this.imagekitService.uploadFile(
          file,
          '/stem-innovation/labs',
        );

      updateData.image =
        uploadedImage.url;

      updateData.imageFileId =
        uploadedImage.fileId;

      // Delete old image
      if (existingLab.imageFileId) {
        try {
          await this.imagekitService.deleteFile(
            existingLab.imageFileId,
          );
        } catch (error) {
          console.error(
            'Failed to delete old lab image:',
            error,
          );
        }
      }
    }

    const updatedLab =
      await this.labModel
        .findByIdAndUpdate(
          id,
          updateData,
          {
            new: true,
            runValidators: true,
          },
        )
        .populate('labItems');

    return {
      success: true,
      message:
        'Lab setup updated successfully',

      lab: updatedLab,
    };
  }

  // =========================
  // DELETE LAB
  // =========================

  async remove(id: string) {
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new BadRequestException(
        'Invalid lab ID',
      );
    }

    const lab =
      await this.labModel.findById(id);

    if (!lab) {
      throw new NotFoundException(
        'Lab setup not found',
      );
    }

    // Delete ImageKit image
    if (lab.imageFileId) {
      try {
        await this.imagekitService.deleteFile(
          lab.imageFileId,
        );
      } catch (error) {
        console.error(
          'Failed to delete lab image:',
          error,
        );
      }
    }

    // Delete database record
    await this.labModel.findByIdAndDelete(id);

    return {
      success: true,
      message:
        'Lab setup deleted successfully',
    };
  }
}