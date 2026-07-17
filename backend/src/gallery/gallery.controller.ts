import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { GalleryService } from "./gallery.service";
import { CreateGalleryDto } from "./dto/create-gallery.dto";
import { multerOptions } from "src/common/multer/multer.config";

@Controller("gallery")
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("image", multerOptions),
  )
  uploadGallery(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.galleryService.create(
      createGalleryDto,
      `/uploads/gallery/${file.filename}`,
    );
  }

  @Get()
  getGallery() {
    return this.galleryService.getGallery();
  }
}