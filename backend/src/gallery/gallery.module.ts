import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Gallery, GallerySchema } from './schemas/gallery.schema';

@Module({

  imports: [
    MongooseModule.forFeature([
      {
        name: Gallery.name,
        schema: GallerySchema,
      }
    ])
  ],
  controllers: [GalleryController],
  providers: [GalleryService]
})
export class GalleryModule {}
