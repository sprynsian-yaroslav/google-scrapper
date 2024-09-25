import {Controller, Post, Get, Param, Query} from '@nestjs/common';
import {ScrapingResultsService} from './scraping-results.service';
import {ScrapingResult} from './scraping-result.entity';
import {KeywordsService} from '../keywords/keywords.service';

@Controller('scraping')
export class ScrapingResultsController {
    constructor(
        private readonly scrapingResultsService: ScrapingResultsService,
        private readonly keywordService: KeywordsService,
    ) {}

    @Post(':keywordId')
    async scrape(@Param('keywordId') keywordId: number): Promise<{ status: string; message: string }> {

        await this.keywordService.update(keywordId, {
            isCheck: true,
        });

        this.scrapingResultsService.scrapeGoogle(keywordId);

        return {
            status: 'Processing',
            message: `Scraping for keyword ID ${keywordId} has started.`,
        };
    }

    @Get('results/:keywordId')
    async findAll(
        @Param('keywordId') keywordId: number,
        @Query('search') search: string,
        @Query('limit') limit = 10,
        @Query('offset') offset = 0,
    ): Promise<{ data: ScrapingResult[], pagination: { totalCount: number, limit: number, offset: number } }> {
        const [data, totalCount] = await this.scrapingResultsService.findByKeywordId({
            keywordId,
            search,
            limit: Number(limit),
            offset: Number(offset),
        });

        return {
            data,
            pagination: {
                totalCount,
                limit: Number(limit),
                offset: Number(offset),
            },
        };
    }

}
