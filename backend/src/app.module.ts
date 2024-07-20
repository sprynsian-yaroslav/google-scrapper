import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from "path";
import { AuthModule } from './auth/auth.module';
import { KeywordsModule } from './keywords/keywords.module';
import { ScrapingResultsModule } from './scraping-results/scraping-results.module';
import { ScheduleModule } from './schedule/schedule.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    MongooseModule.forRoot('mongodb+srv://slavkosprunsyan:DHl8DVurVBWFHLCa@cluster0.jt559lj.mongodb.net/google-scanner'),
    AuthModule,
    KeywordsModule,
    ScrapingResultsModule,
    ScheduleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
