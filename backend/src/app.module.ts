import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { GalleryModule } from './gallery/gallery.module';
import { ContactModule } from './contact/contact.module';
import { BlogModule } from './blog/blog.module';
import { LabModule } from './lab/lab.module';
import { LabItemModule } from './lab-item/lab-item.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    //Connect to MongoDb
    MongooseModule.forRoot(process.env.MONGO_URI!),

    //Feature modules
    AdminModule,

    AuthModule,

    GalleryModule,

    BlogModule,

    ContactModule,

    LabModule,

    LabItemModule,
  ],

})
export class AppModule {}
