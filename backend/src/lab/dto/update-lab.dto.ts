import { PartialType } from "@nestjs/mapped-types";
import { CreateLabItemDto } from "src/lab-item/dto/create-lab-item.dto";

export class UpdateLabItemDto extends PartialType(
  CreateLabItemDto,
) {}