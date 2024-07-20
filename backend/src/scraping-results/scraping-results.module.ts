import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapingResultsService } from './scraping-results.service';
import { ScrapingResultsController } from './scraping-results.controller';
import { ScrapingResultSchema } from './scraping-result.schema';
import { KeywordsModule } from '../keywords/keywords.module';
import { CronService } from '../cron/cron.service';

@Module({
  imports: [
    KeywordsModule,
    MongooseModule.forFeature([
      { name: 'ScrapingResults', schema: ScrapingResultSchema },
    ]),
  ],
  providers: [ScrapingResultsService, CronService],
  controllers: [ScrapingResultsController],
  exports: [ScrapingResultsService],
})
export class ScrapingResultsModule {}
