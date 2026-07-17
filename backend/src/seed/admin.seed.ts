import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcryptjs';
import { Admin, AdminDocument } from "src/admin/schemas/admin.schema";



@Injectable()

export class AdminSeed implements OnModuleInit {
    constructor(
        @InjectModel(Admin.name)
        private readonly adminModel: Model<AdminDocument>,
    ) {}

    async onModuleInit() {
        await this.seedAdmin();
    }

    private async seedAdmin() {
        const adminEmail = process.env.ADMIN_EMAIL;

        const existingAdmin = await this.adminModel.findOne({
            email: adminEmail,
        });


        if(existingAdmin) {
            console.log("Admin Already Exist");
            return;
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

        await this.adminModel.create({
            name: process.env.ADMIN_NAME,
            email: adminEmail,
            password: hashedPassword,
        });

        console.log("Default Admin Created Successfu;;y");
    }
}