import { Module } from '@nestjs/common';
import { LabController } from './lab.controller';
import { LabService } from './lab.service';
import { LabItemController } from './lab-item/lab-item.controller';
import { LabItemService } from './lab-item/lab-item.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lab, LabSchema } from './schemas/lab.schema';
import { LabItem, LabItemSchema } from './schemas/lab-item.schema';
import { ImagekitModule } from 'src/imageKit/imagekit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Lab.name,
        schema: LabSchema
      },
      {
        name: LabItem.name,
        schema: LabItemSchema
      }
    ]),
    ImagekitModule
  ],
  controllers: [LabController, LabItemController],
  providers: [LabService, LabItemService],
  exports: [
    LabService,
    LabItemService,
  ],

})
export class LabModule {}
