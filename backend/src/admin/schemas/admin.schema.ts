import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type AdminDocument = HydratedDocument<Admin>;


@Schema({
    timestamps: true,
})

export class Admin {
    @Prop({
        required: true
    })
    name!: string;


    @Prop({
        required: true,
        unique: true,
    })
    email! : string;

    @Prop({
        required: true,
    })
    password! : string;

}

export const AdminSchema = SchemaFactory.createForClass(Admin);