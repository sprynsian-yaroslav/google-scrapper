import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { KeywordSchema } from './keywords.schema';
import { CronService } from '../cron/cron.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Keywords', schema: KeywordSchema }]),
  ],
  providers: [KeywordsService, CronService],
  controllers: [KeywordsController],
  exports: [KeywordsService],
})
export class KeywordsModule {}
