import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import serverlessExpress from '@codegenie/serverless-express';
import cookieParser from 'cookie-parser';
import { join } from 'path';

import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/all-exceptions.filter';

const expressApp = express();

let server: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  // Cookie Parser
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Static Files
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // Initialize NestJS
  await app.init();

  // Create Serverless Handler
  server = serverlessExpress({
    app: expressApp,
  });
}

export default async function handler(req: any, res: any) {
  if (!server) {
    await bootstrap();
  }

  return server(req, res);
}