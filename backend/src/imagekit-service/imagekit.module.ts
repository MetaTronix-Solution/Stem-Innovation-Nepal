import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagekitService } from './imagekit.service';

@Module({
  imports: [ConfigModule],
  providers: [ImagekitService],
  exports: [ImagekitService],
})
export class ImagekitModule {}