import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from "path";
import { AuthModule } from './auth/auth.module';
import { KeywordsModule } from './keywords/keywords.module';
import { ScrapingResultsModule } from './scraping-results/scraping-results.module';
import { ScheduleModule } from './schedule/schedule.module';
import {User} from "./users/users.entity";
import {Keyword} from "./keywords/keywords.entity";
import {ScrapingResult} from "./scraping-results/scraping-result.entity";

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Keyword, ScrapingResult],
      synchronize: true,
    }),
    AuthModule,
    KeywordsModule,
    ScrapingResultsModule,
    ScheduleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

