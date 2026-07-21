import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { LabItem } from "src/lab-item/schemas/lab-item.schema";


export type LabDocument = HydratedDocument<Lab>;


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
    image!: string;

    @Prop({
        required: true
    })
    price!: Number;

    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "LabItem",
            },
        ],
        default: [],
    })
    labItems!: mongoose.Types.ObjectId[];



 }

 export const LabSchema = SchemaFactory.createForClass(Lab);