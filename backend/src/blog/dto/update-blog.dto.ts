import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';

//PartialType -> It takes every property from CreateBlogDto and makes it optional.

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
