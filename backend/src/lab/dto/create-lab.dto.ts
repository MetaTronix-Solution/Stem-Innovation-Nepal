import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { LabStatus } from '../schemas/lab.schema';

export class CreateLabDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(LabStatus)
  status?: LabStatus;
}