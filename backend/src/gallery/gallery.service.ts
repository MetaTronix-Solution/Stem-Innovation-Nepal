import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';
import { Model } from 'mongoose';
import { CreateGalleryDto } from './dto/create-gallery.dto';

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


}
