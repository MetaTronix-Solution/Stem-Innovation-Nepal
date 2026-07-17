import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";



export type GalleryDocument = HydratedDocument<Gallery>;

@Schema({
    timestamps: true
})


export class Gallery {
    @Prop({
        required: true,
    })
    caption!: string;

    @Prop({
        required: true,
    })
    image!: string
}


export const GallerySchema = SchemaFactory.createForClass(Gallery)