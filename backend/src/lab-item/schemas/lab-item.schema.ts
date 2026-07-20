import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type LabItemDocument = LabItem & Document;

@Schema({
  timestamps: true,
})
export class LabItem {

  @Prop({
    required: true,
    trim: true,
  })
  title!: string;

  @Prop({
    required: true,
    trim: true,
  })
  description!: string;

  @Prop({
    required: true,
  })
  specification!: string;

  @Prop({
    required: true,
    min: 0,
  })
  price!: number;

  @Prop({
    default: 0,
    min: 0,
  })
  quantity!: number;

  @Prop({
    required: true,
  })
  image!: string;

  @Prop({
    type: Types.ObjectId,
    ref: "LabCategory",
    required: true,
  })
  category!: Types.ObjectId;
}

export const LabItemSchema =
SchemaFactory.createForClass(LabItem);