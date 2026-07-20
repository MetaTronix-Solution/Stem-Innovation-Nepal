import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  content!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  author!: string;

  @IsBoolean()
  published!: boolean;
}
