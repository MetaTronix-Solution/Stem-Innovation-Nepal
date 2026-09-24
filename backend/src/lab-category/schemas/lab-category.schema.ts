import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LabCategoryDocument = HydratedDocument<LabCategory>;

@Schema({
  timestamps: true,
})
export class LabCategory {
  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  name!: string;

  @Prop({
    required: false,
    trim: true,
  })
  description?: string;
}

export const LabCategorySchema =
  SchemaFactory.createForClass(LabCategory);