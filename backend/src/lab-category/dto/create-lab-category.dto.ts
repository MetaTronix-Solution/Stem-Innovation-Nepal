import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLabCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}