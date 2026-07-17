import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';
import { Model } from 'mongoose';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';



@Injectable()
export class GalleryService {
    constructor(
        @InjectModel(Gallery.name)
        private readonly galleryModel: Model<GalleryDocument>
    ) {}


    // post image
    async create(
        createGalleryDto: CreateGalleryDto,
        image: string
    ) {
        const gallery = await this.galleryModel.create({
            ...createGalleryDto,
            image,
        });

        return {
            success: true,
            message: "Gallery image uploaded successfully",
        }
    }


    // get gallery
    async getGallery() {
        const gallery = await this.galleryModel.find().sort({ createdAt: -1});

        return {
            success: true,
            gallery
        }
    }


    // delete the gallery

    async deleteGallery(id: string) {
  // Find the gallery item
  const gallery = await this.galleryModel.findById(id);

  if (!gallery) {
    throw new NotFoundException('Gallery image not found');
  }

  // Full path to the image
  const imagePath = path.join(process.cwd(), gallery.image);

  // Delete image from uploads folder if it exists
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  // Delete document from MongoDB
  await this.galleryModel.findByIdAndDelete(id);

  return {
    success: true,
    message: 'Gallery image deleted successfully',
  };
}


}
