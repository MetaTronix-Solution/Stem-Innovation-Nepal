import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LabItemDocument = HydratedDocument<LabItem>;

export enum LabItemStatus {
  AVAILABLE = 'AVAILABLE',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  EXPIRED = 'EXPIRED',
}

@Schema({ timestamps: true })
export class LabItem {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  })
  itemCode!: string;

  @Prop({
    trim: true,
  })
  category?: string;

  @Prop({
    required: true,
    min: 0,
    default: 0,
  })
  quantity!: number;

  @Prop({
    trim: true,
  })
  unit?: string;

  @Prop({
    min: 0,
    default: 0,
  })
  minimumStock!: number;

  @Prop({
    min: 0,
    default: 0,
  })
  price!: number;

  @Prop()
  expiryDate?: Date;

  @Prop({
    enum: LabItemStatus,
    default: LabItemStatus.AVAILABLE,
  })
  status!: LabItemStatus;

  @Prop({
    type: Types.ObjectId,
    ref: 'Lab',
    required: true,
  })
  lab!: Types.ObjectId;
}

export const LabItemSchema = SchemaFactory.createForClass(LabItem);