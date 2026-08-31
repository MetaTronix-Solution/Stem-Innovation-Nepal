import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import mongoose, {
  HydratedDocument,
} from 'mongoose';

export type LabDocument =
  HydratedDocument<Lab>;

@Schema({
  timestamps: true,
})
export class Lab {
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

  // ImageKit URL
  @Prop({
    required: true,
  })
  image!: string;

  // ImageKit file ID
  @Prop({
    required: true,
  })
  imageFileId!: string;

  @Prop({
    required: true,
    min: 0,
  })
  price!: number;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabItem',
      },
    ],
    default: [],
  })
  labItems!: mongoose.Types.ObjectId[];
}

export const LabSchema =
  SchemaFactory.createForClass(Lab);