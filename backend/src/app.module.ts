import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { GalleryModule } from './gallery/gallery.module';
import { BlogModule } from './blog/blog.module';

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
  ],
})
export class AppModule {}
