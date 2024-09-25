import { Module } from '@nestjs/common';
import { ScrapingResultsService } from './scraping-results.service';
import { ScrapingResultsController } from './scraping-results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapingResult } from './scraping-result.entity';
import { KeywordsModule } from '../keywords/keywords.module';
import {AIModule} from "../ai/ai.module";

@Module({
  imports: [TypeOrmModule.forFeature([ScrapingResult]), KeywordsModule, AIModule],
  providers: [ScrapingResultsService],
  controllers: [ScrapingResultsController],
})
export class ScrapingResultsModule {}
