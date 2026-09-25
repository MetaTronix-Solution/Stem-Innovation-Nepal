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

@Injectable()
export class LabService {
  constructor(
    @InjectModel(Lab.name)
    private readonly labModel: Model<LabDocument>,

    @InjectModel(LabItem.name)
    private readonly labItemModel: Model<LabItemDocument>,
  ) {}

  // CREATE LAB
  async create(createLabDto: CreateLabDto) {
    const { labItems = [] } = createLabDto;

    // Check whether all Lab Items exist
    if (labItems.length > 0) {
      const existingLabItems =
        await this.labItemModel.find({
          _id: { $in: labItems },
        });

      if (existingLabItems.length !== labItems.length) {
        throw new NotFoundException(
          'One or more lab items not found',
        );
      }
    }

    const lab = await this.labModel.create(
      createLabDto,
    );

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
  ) {
    const lab =
      await this.labModel.findById(id);

    if (!lab) {
      throw new NotFoundException(
        'Lab not found',
      );
    }

    // Check Lab Items when updating
    if (updateLabDto.labItems) {
      const labItems = updateLabDto.labItems;

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

    const updatedLab =
      await this.labModel
        .findByIdAndUpdate(
          id,
          updateLabDto,
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