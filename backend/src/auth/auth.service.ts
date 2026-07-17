import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/admin/schemas/admin.schema';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';





@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Admin.name)
        private readonly adminModel: Model<AdminDocument>,
        private readonly jwtService: JwtService,
    ) {}


    // Admin Login
    async login(loginDto: LoginDto, response: Response) {
        try {
            const {email, password} = loginDto;

            if(!email || !password) {
                return {
                    success: false,
                    message: "All fields required"
                }
            }

            const admin = await this.adminModel.findOne({email});

            if(!admin) {
                return {
                    success: false,
                    message: "Invalid email or password"
                }
            }

            //compare Password
            const isMatch = await bcrypt.compare(password, admin.password);

            if(!isMatch) {
                return{
                    success: false,
                    message: "Invalid Password"
                }
            }

            //Generate JWT
            const token = await this.jwtService.signAsync({id: admin._id, email: admin.email});

            //Save Cookies
            response.cookie("AdminToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return {
                success: true,
                message: "Login Successfully",
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                },
            };
        } catch (error: any) {
            return {
                success: false,
                message: "Internal Server Error",
                error: error.message
            }
        }
    }


    //logout

    async logout(response: Response) {
  response.clearCookie("AdminToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return {
    success: true,
    message: "Logout Successfully",
  };
}
}
