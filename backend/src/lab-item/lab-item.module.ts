import { Module } from '@nestjs/common';
import { LabItemController } from './lab-item.controller';
import { LabItemService } from './lab-item.service';
import { LabItem, LabItemSchema } from './schemas/lab-item.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
        {
      name: LabItem.name,
      schema: LabItemSchema,
      }
    ])

  ],

  controllers: [LabItemController],
  providers: [LabItemService]
})
export class LabItemModule {}
