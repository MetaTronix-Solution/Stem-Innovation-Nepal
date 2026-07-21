import { Module } from '@nestjs/common';
import { LabController } from './lab.controller';
import { LabService } from './lab.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lab, LabSchema } from './schemas/lab.schema';
import { LabItem, LabItemSchema } from 'src/lab-item/schemas/lab-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Lab.name,
        schema: LabSchema
      },

      {
        name: LabItem.name,
        schema: LabItemSchema,
      },
    ]),
  ],
  controllers: [LabController],
  providers: [LabService]
})
export class LabModule {}
