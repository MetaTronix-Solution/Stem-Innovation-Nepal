import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Lab,
  LabDocument,
} from './schemas/lab.schema';

import {
  LabItem,
  LabItemDocument,
} from '../lab-item/schemas/lab-item.schema';

import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';
import { ImagekitService } from '../imagekit-service/imagekit.service';

@Injectable()
export class LabService {
  constructor(
    @InjectModel(Lab.name)
    private readonly labModel: Model<LabDocument>,

    @InjectModel(LabItem.name)
    private readonly labItemModel: Model<LabItemDocument>,

    private readonly imagekitService: ImagekitService,
  ) {}

  // CREATE LAB

async create(
  createLabDto: CreateLabDto,
  file?: Express.Multer.File,
) {
  // Convert labItems into an array
  let labItems: string[] = [];

  if (createLabDto.labItems) {
    if (Array.isArray(createLabDto.labItems)) {
      labItems = createLabDto.labItems;
    } else {
      labItems = [createLabDto.labItems];
    }
  }

  // Check whether all Lab Items exist
  if (labItems.length > 0) {
    const existingLabItems =
      await this.labItemModel.find({
        _id: { $in: labItems },
      });

    console.log(
      'Found Lab Items:',
      existingLabItems.length,
    );

    if (existingLabItems.length !== labItems.length) {
      throw new NotFoundException(
        'One or more lab items not found',
      );
    }
  }

  // Upload image to ImageKit
  let image: string | undefined;

  if (file) {
    const uploadedImage =
      await this.imagekitService.uploadFile(
        file,
        'uploads/labs',
      );

    image = uploadedImage.url;
  }

  // Create Lab
  const lab = await this.labModel.create({
    title: createLabDto.title,
    description: createLabDto.description,
    price: createLabDto.price,
    labItems,
    image,
  });

  return {
    message: 'Lab created successfully',
    lab,
  };
}




  // GET ALL LABS
  async findAll() {
    const labs = await this.labModel
      .find()
      .populate(
        'labItems',
        'title description specification price quantity image category',
      )
      .sort({ createdAt: -1 });

    return {
      message: 'Labs fetched successfully',
      labs,
    };
  }

  // GET SINGLE LAB
  async findOne(id: string) {
    const lab = await this.labModel
      .findById(id)
      .populate(
        'labItems',
        'title description specification price quantity image category',
      );

    if (!lab) {
      throw new NotFoundException(
        'Lab not found',
      );
    }

    return {
      message: 'Lab fetched successfully',
      lab,
    };
  }

 // UPDATE LAB
async update(
  id: string,
  updateLabDto: UpdateLabDto,
  file?: Express.Multer.File,
) {
  const lab =
    await this.labModel.findById(id);

  if (!lab) {
    throw new NotFoundException(
      'Lab not found',
    );
  }

  // Convert labItems into an array
  let labItems: string[] | undefined;

  if (updateLabDto.labItems) {
    if (Array.isArray(updateLabDto.labItems)) {
      labItems = updateLabDto.labItems;
    } else {
      labItems = [updateLabDto.labItems];
    }

    // Check whether all Lab Items exist
    if (labItems.length > 0) {
      const existingLabItems =
        await this.labItemModel.find({
          _id: { $in: labItems },
        });

      if (
        existingLabItems.length !==
        labItems.length
      ) {
        throw new NotFoundException(
          'One or more lab items not found',
        );
      }
    }
  }

  const updateData: any = {
    ...updateLabDto,
  };

  // Use converted array
  if (labItems !== undefined) {
    updateData.labItems = labItems;
  }

  // Upload new image if provided
  if (file) {
    const uploadedImage =
      await this.imagekitService.uploadFile(
        file,
        'uploads/labs',
      );

    updateData.image = uploadedImage.url;
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
      .populate(
        'labItems',
        'title description specification price quantity image category',
      );

  return {
    message: 'Lab updated successfully',
    lab: updatedLab,
  };
}
  // DELETE LAB
  async remove(id: string) {
    const lab =
      await this.labModel.findById(id);

    if (!lab) {
      throw new NotFoundException(
        'Lab not found',
      );
    }

    await this.labModel.findByIdAndDelete(id);

    return {
      message: 'Lab deleted successfully',
    };
  }
}