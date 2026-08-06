import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GalleryDocument = HydratedDocument<Gallery>;

@Schema({
  timestamps: true,
})
export class Gallery {
  @Prop({
    required: true,
    trim: true,
  })
  caption!: string;

  @Prop({
    required: true,
  })
  image!: string;

  @Prop({
    required: true,
  })
  fileId!: string;
}

export const GallerySchema =
  SchemaFactory.createForClass(Gallery);