import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { LabCategory } from "src/lab-category/schemas/lab-category.schema";


export type LabItemDocument = HydratedDocument<LabItem>;

@Schema({
    timestamps: true,
})

export class LabItem{

    @Prop({
        required: true,
        trim: true
    })
    title!: string;

    @Prop({
        required: true,
        trim: true
    })
    description!: string;

    @Prop({
        required: true,
        trim: true
    })
    specification!: string;

    @Prop({
    required: true,
    min: 0,
    })
    price!: number;

    @Prop({
        required: true,
        min: 0,
        default: 0,
    })
    quantity!: number;

    @Prop({
        required: false,
        trim: true,
    })
    image?: string;

    @Prop({
        type: Types.ObjectId,
        ref: LabCategory.name,
        required: true,
    })
    category!: Types.ObjectId;
}


export const LabItemSchema = SchemaFactory.createForClass(LabItem)