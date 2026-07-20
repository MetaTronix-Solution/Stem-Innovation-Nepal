import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type LabDocument = Lab & Document;


@Schema({
    timestamps: true,
})

 export class Lab {
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
    })
    specification!: string;

    @Prop({
        required: true,
        min: 0,
    })
    price!: number;

    @Prop({
        required: true
    })
    category!: string;

    @Prop({
        default: "/uploads/default.png"
    })
    image!: string;

    @Prop({
        default: true
    })
    isActive!: boolean;

 }

 export const LabSchema = SchemaFactory.createForClass(Lab);