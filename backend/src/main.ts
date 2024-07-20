import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { sessionConfig } from "./session.config";
import { configureHandlebars } from "./hbs/hbs-configure";



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.use(sessionConfig);

  app.use(bodyParser.urlencoded({ extended: true }));

  configureHandlebars(app)

  await app.listen(3000);
}

bootstrap();
