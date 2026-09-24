import { Module } from '@nestjs/common';
import { LabCategoryController } from './lab-category.controller';
import { LabCategoryService } from './lab-category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LabCategory, LabCategorySchema } from './schemas/lab-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LabCategory.name,
        schema: LabCategorySchema
      }
    ])
  ],
  controllers: [LabCategoryController],
  providers: [LabCategoryService],
  exports: [LabCategoryService]
})
export class LabCategoryModule {}
