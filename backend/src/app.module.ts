import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { GalleryModule } from './gallery/gallery.module';
import { ContactModule } from './contact/contact.module';
import { BlogModule } from './blog/blog.module';
import { LabModule } from './lab/lab.module';
import { LabItemModule } from './lab-item/lab-item.module';
import { ImagekitModule } from './imageKit/imagekit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    AdminModule,
    AuthModule,
    GalleryModule,
    ContactModule,
    BlogModule,
    LabModule,
    LabItemModule,
    ImagekitModule
  ],
})
export class AppModule {}