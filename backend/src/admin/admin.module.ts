import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { AdminSeed } from 'src/seed/admin.seed';

@Module({

  imports:[
    MongooseModule.forFeature([
      {
        name: Admin.name,
        schema: AdminSchema
      },
    ]),
  ],

  controllers: [AdminController],
  providers: [AdminService, AdminSeed],
  exports: [MongooseModule],
})
export class AdminModule {}
