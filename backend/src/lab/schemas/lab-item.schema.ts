import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
  Types,
} from 'mongoose';

export type LabItemDocument =
  HydratedDocument<LabItem>;

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
    trim: true,
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

  // @Prop({
  //   type: Types.ObjectId,
  //   ref: 'LabCategory',
  //   required: true,
  // })
  // category!: Types.ObjectId;
}

export const LabItemSchema =
  SchemaFactory.createForClass(LabItem);