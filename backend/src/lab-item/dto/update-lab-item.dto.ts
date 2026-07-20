import { PartialType } from "@nestjs/mapped-types";
import { CreateLabItemDto } from "./create-lab-item.dto";

export class UpdateLabItemDto extends PartialType(
  CreateLabItemDto,
) {}