import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";



export class CreateLabDto {
    @IsString()
    @IsNotEmpty()

    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;


    @IsString()
    @IsNotEmpty()
    specification!: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price!: number;

    @IsString()
    @IsNotEmpty()
    category!: string;

}