import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LabItem } from '../../lab-item/schemas/lab-item.schema';

export type LabDocument = HydratedDocument<Lab>;

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

  @Prop({
    required: false,
    trim: true,
  })
  image?: string;

  @Prop({
    required: true,
    min: 0,
  })
  price!: number;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: LabItem.name,
      },
    ],
    default: [],
  })
  labItems!: Types.ObjectId[];
}

export const LabSchema = SchemaFactory.createForClass(Lab);