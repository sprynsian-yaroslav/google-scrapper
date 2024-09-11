import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {AppDataSource} from "./data-source";
require('dotenv').config()

async function bootstrap() {
  await AppDataSource.initialize();

  const app = await NestFactory.create(AppModule);

  // Використання валідаційного пайпу для автоматичної валідації DTO
  app.useGlobalPipes(new ValidationPipe());

  // Налаштування CORS для дозволу запитів з інших доменів
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
  console.log('Application is running on: ' + await app.getUrl());
}
bootstrap();