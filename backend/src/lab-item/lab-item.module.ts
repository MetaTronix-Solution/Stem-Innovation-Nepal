import { Module } from '@nestjs/common';
import { LabItemController } from './lab-item.controller';
import { LabItemService } from './lab-item.service';
import { LabItem, LabItemSchema } from './schemas/lab-item.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ImagekitModule } from '../imageKit/imagekit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
        {
      name: LabItem.name,
      schema: LabItemSchema,
      }
    ]),
    ImagekitModule

  ],

  controllers: [LabItemController],
  providers: [LabItemService]
})
export class LabItemModule {}
