import {
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  Min,
} from "class-validator";

export class CreateLabItemDto {

  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  specification!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsMongoId()
  category!: string;
}