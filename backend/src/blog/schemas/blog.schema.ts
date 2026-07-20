import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Blog {
  @Prop({
    required: true,
    trim: true,
    minlength: 5,
    maxLength: 150,
  })
  title!: string;

  @Prop({
    required: true,
  })
  imageUrl!: string;

  @Prop({
    required: true,
    minlength: 20,
  })
  content!: string;

  @Prop({
    required: true,
    trim: true,
  })
  author!: string;

  @Prop({
    default: false,
  })
  published!: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
