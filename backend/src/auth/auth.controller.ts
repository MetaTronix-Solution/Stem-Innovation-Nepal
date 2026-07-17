import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetAdmin } from './decorators/get-admin.decorator';




@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}


    @Post("login")
    login(
        @Body() loginDto: LoginDto,
        @Res({passthrough: true}) response: Response,
    ) {
        return this.authService.login(loginDto, response)
    }


    @Get("me")
    @UseGuards(JwtAuthGuard)
    getme(
        @GetAdmin() admin: any,
    ) {
        return {
            success: true,
            admin
        }
    }

    @Post("logout")
    logout(
        @Res({passthrough: true}) response: Response,
    ) {
        return this.authService.logout(response)
    }
}
