import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/admin/schemas/admin.schema';
import { JwtModule } from '@nestjs/jwt';
import {  ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({

  imports:[
    PassportModule,
    MongooseModule.forFeature([
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),

    JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: '7d',
    },
  }),
}),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
