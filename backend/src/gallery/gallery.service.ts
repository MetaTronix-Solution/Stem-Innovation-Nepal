import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Gallery, GalleryDocument } from './schemas/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { ImagekitService } from '../imageKit/imagekit.service';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name)
    private readonly galleryModel: Model<GalleryDocument>,

    private readonly imagekitService: ImagekitService,
  ) {}

  async create(
    createGalleryDto: CreateGalleryDto,
    file: Express.Multer.File,
  ) {
    const uploaded = await this.imagekitService.uploadFile(
      file,
      '/gallery',
    );

    await this.galleryModel.create({
      ...createGalleryDto,
      image: uploaded.url,
      fileId: uploaded.fileId,
    });

    return {
      success: true,
      message: 'Gallery image uploaded successfully',
    };
  }

  async getGallery() {
    const gallery = await this.galleryModel.find().sort({
      createdAt: -1,
    });

    return {
      success: true,
      gallery,
    };
  }

  async deleteGallery(id: string) {
    const gallery = await this.galleryModel.findById(id);

    if (!gallery) {
      throw new NotFoundException(
        'Gallery image not found',
      );
    }

    await this.imagekitService.deleteFile(gallery.fileId);

    await this.galleryModel.findByIdAndDelete(id);

    return {
      success: true,
      message: 'Gallery image deleted successfully',
    };
  }
}