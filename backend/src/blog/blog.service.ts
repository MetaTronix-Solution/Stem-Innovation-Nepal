import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Blog } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ImagekitService } from '../imageKit/imagekit.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<Blog>,

    private readonly imagekitService: ImagekitService
  ) {}

  //create blog
  async createBlog(
    createBlogDto: CreateBlogDto,
    file: Express.Multer.File,
    author: string,
  ) {
    try {
      const uploadedImage = await this.imagekitService.uploadFile(
  file,
  "/blog",
);

const blog = await this.blogModel.create({
  ...createBlogDto,
  imageUrl: uploadedImage.url,
  imageFileId: uploadedImage.fileId,
  author,
});

      return {
        success: true,
        message: 'Blog created successfully',
        data: blog,
      };
    } catch (error) {
      console.error('CREATE BLOG ERROR:', error);
      throw new InternalServerErrorException('Failed to create blog');
    }
  }

  async findAllBlogs() {
    return await this.blogModel.find().sort({
      createdAt: -1,
    });
  }

  async findPublishedBlogs() {
    return await this.blogModel
      .find({ published: true })
      .sort({ createdAt: -1 });
  }

  async findOnePublishedBlog(id: string) {
    const blog = await this.blogModel.findOne({ _id: id, published: true });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async findOneBlog(id: string) {
    const blog = await this.blogModel.findById(id);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async updateBlog(
    id: string,
    updateBlogDto: UpdateBlogDto,
    file?: Express.Multer.File,
  ) {
    const updateData: any = {
      ...updateBlogDto,
    };

    if (file) {
    const uploadedImage = await this.imagekitService.uploadFile(
    file,
    "blog",
    );

  updateData.imageUrl = uploadedImage.url;
}

    const updatedBlog = await this.blogModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      throw new NotFoundException('Blog not found');
    }

    return {
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog,
    };
  }

  async deleteBlog(id: string) {
    const blog = await this.blogModel.findById(id);

    if (!blog) {
    throw new NotFoundException("Blog not found");
    }

    // delete image from ImageKit
   if (blog.imageFileId) {
  await this.imagekitService.deleteFile(blog.imageFileId);
}

await blog.deleteOne();

return {
  success: true,
  message: "Blog deleted successfully",
};
  }
}
