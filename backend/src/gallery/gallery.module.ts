import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Gallery, GallerySchema } from './schemas/gallery.schema';
import { ImagekitModule } from '../imageKit/imagekit.module';

@Module({

  imports: [
    MongooseModule.forFeature([
      {
        name: Gallery.name,
        schema: GallerySchema,
      }
    ]),
    ImagekitModule
  ],
  controllers: [GalleryController],
  providers: [GalleryService]
})
export class GalleryModule {}
