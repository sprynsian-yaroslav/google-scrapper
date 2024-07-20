import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { KeywordsService } from '../keywords/keywords.service';
import { ScrapingResultsService } from './scraping-results.service';

@Controller('scraping-result')
export class ScrapingResultsController {
  constructor(
    private readonly scrapingResultsService: ScrapingResultsService,
    private readonly keywordsService: KeywordsService,
  ) {}

  @Get('/check/:keywordId')
  async checkKeyword(@Req() req: Request, @Res() res: Response) {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    this.scrapingResultsService.scrapeGoogle(req.params.keywordId);

    return res.redirect(`/keywords/${req.params.keywordId}`);
  }

  @Get('/:id/toggle')
  async toggleScheduledStatus(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    const keyword = await this.keywordsService.findById(id);
    if (!keyword) {
      return res.status(404).json('Keyword not found');
    }

    const action = () => this.scrapingResultsService.scrapeGoogle(id);

    await this.scrapingResultsService.updateScheduledStatus(
      id,
      !keyword.isScheduled,
      action,
    );

    return res.redirect(`/keywords`);
  }
}
