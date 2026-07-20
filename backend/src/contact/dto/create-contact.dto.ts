import { IsNotEmpty, IsString } from "class-validator";



export class CreateContactDto {
    @IsString()
    @IsNotEmpty()
    name!: string;


    @IsString()
    @IsNotEmpty()
    emailOrPhone!: string;

    @IsString()
    @IsNotEmpty()
    school!: string;

    @IsString()
    @IsNotEmpty()
    message!: string;

}