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
  ],

  controllers: [LabController],

  providers: [LabService],

  exports: [LabService],
})
export class LabModule {}