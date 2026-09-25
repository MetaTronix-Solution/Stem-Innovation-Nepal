import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LabItemController } from './lab-item.controller';
import { LabItemService } from './lab-item.service';

import {
  LabItem,
  LabItemSchema,
} from './schemas/lab-item.schema';

import {
  LabCategory,
  LabCategorySchema,
} from '../lab-category/schemas/lab-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LabItem.name,
        schema: LabItemSchema,
      },
      {
        name: LabCategory.name,
        schema: LabCategorySchema,
      },
    ]),
  ],
  controllers: [LabItemController],
  providers: [LabItemService],
  exports: [LabItemService],
})
export class LabItemModule {}