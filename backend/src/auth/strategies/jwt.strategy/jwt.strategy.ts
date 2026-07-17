import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Admin, AdminDocument } from "src/admin/schemas/admin.schema";




const cookieExtractor = (req: any): string | null => {
    if(req && req.cookies) {
        return req.cookies.Admintoken;
    }

    return null;
};



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(Admin.name)
        private readonly adminModel: Model<AdminDocument>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                cookieExtractor,
            ]),

            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET!,
        });
    }

    async validate(payload: any) {
        const admin = await this.adminModel.findById(payload.id).select("-password");

        if(!admin) {
            throw new UnauthorizedException("Admin not found");
        }

        return admin;
    }

}



