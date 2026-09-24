import { Module } from '@nestjs/common';
import { LabCategoryController } from './lab-category.controller';
import { LabCategoryService } from './lab-category.service';

@Module({
  controllers: [LabCategoryController],
  providers: [LabCategoryService]
})
export class LabCategoryModule {}
