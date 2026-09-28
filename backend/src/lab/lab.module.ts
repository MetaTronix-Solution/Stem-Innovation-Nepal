import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LabController } from './lab.controller';
import { LabService } from './lab.service';

import {
  Lab,
  LabSchema,
} from './schemas/lab.schema';

import {
  LabItem,
  LabItemSchema,
} from '../lab-item/schemas/lab-item.schema';
import { ImagekitModule } from 'src/imageKit/imagekit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Lab.name,
        schema: LabSchema,
      },
      {
        name: LabItem.name,
        schema: LabItemSchema,
      },
    ]),
    ImagekitModule
  ],

  controllers: [LabController],

  providers: [LabService],

  exports: [LabService],
})
export class LabModule {}