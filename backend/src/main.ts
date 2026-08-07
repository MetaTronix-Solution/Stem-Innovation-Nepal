import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from 'cookie-parser';
import { join } from "path";


async function bootstrap() {
  const app =
  await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);
  app.use(cookieParser());

  app.enableCors({
  origin: [
    "http://localhost:3000",
    "https://stem-innovation-nepal-wecr.vercel.app",
  ],
  credentials: true,
});


  app.useGlobalFilters(new AllExceptionsFilter());

  app.useStaticAssets(join(__dirname, "..", "uploads"), {
  prefix: "/uploads",
  });

  await app.listen(process.env.PORT ?? 4001);
}

bootstrap();