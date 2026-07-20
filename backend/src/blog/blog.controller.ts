import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogService } from './blog.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer/multer.config';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions('blog')))
  createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }
    return this.blogService.createBlog(createBlogDto, file);
  }

  @Get()
  findAll() {
    return this.blogService.findAllBlogs();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOneBlog(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions('blog')))
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogService.updateBlog(id, updateBlogDto, file);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.blogService.deleteBlog(id);
  }
}
