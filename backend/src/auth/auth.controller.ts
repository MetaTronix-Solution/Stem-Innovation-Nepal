import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';




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
}
