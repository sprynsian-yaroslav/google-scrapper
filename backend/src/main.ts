import * as path from 'path';
import * as dotenv from 'dotenv';

const envFilePath = path.join(__dirname, '../.env');
dotenv.config({ path: envFilePath });

// Логуємо, щоб переконатися, що змінні з .env підтягуються
console.log("Loaded environment variables:", process.env);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {AppDataSource} from "./data-source";
import {createDefaultUser} from "./seeds/user.seed";

async function bootstrap() {
  await AppDataSource.initialize();

  const app = await NestFactory.create(AppModule);

  // Використання валідаційного пайпу для автоматичної валідації DTO
  app.useGlobalPipes(new ValidationPipe());

  // Налаштування CORS для дозволу запитів з інших доменів
  app.enableCors();

  console.log("-----process.env------", process.env)
    await app.listen(process.env.PORT || 3000);

    await createDefaultUser();
  console.log('Application is running on: ' + await app.getUrl());
}
bootstrap();