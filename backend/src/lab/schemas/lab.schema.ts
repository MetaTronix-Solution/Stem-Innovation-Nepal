import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LabDocument = HydratedDocument<Lab>;

export enum LabStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Lab {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    trim: true,
  })
  description?: string;

  @Prop({
    trim: true,
  })
  location?: string;

  @Prop({
    trim: true,
  })
  contactNumber?: string;

  @Prop({
    trim: true,
    lowercase: true,
  })
  email?: string;

  @Prop({
    enum: LabStatus,
    default: LabStatus.ACTIVE,
  })
  status!: LabStatus;
}

export const LabSchema = SchemaFactory.createForClass(Lab);