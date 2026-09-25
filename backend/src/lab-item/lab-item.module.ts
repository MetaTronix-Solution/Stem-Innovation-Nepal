import { Module } from '@nestjs/common';
import { LabItemController } from './lab-item.controller';
import { LabItemService } from './lab-item.service';

@Module({
  controllers: [LabItemController],
  providers: [LabItemService]
})
export class LabItemModule {}
