import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { Keyword } from './keywords.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  providers: [KeywordsService],
  controllers: [KeywordsController],
  exports: [KeywordsService],
})
export class KeywordsModule {}