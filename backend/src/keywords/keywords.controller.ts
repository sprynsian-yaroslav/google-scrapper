import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { KeywordsService } from './keywords.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { CustomValidationPipe } from '../common/pipes';
import { keywordsTableSchema } from '../hbs/table-schemas/keywords.table-schema';
import { scrapingResultTableSchema } from '../hbs/table-schemas/scraping-result.table-schema';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Get('/')
  @Render('keywordsList')
  async getKeywordList(@Req() req: Request, @Res() res: Response) {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    const keywords = await this.keywordsService.findAll();

    console.log('keywords: ', keywords);

    return {
      keywords,
      tableColumns: keywordsTableSchema,
    };
  }

  @Post('/')
  @UsePipes(new CustomValidationPipe())
  async createKeyword(
    @Body() body: CreateKeywordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    try {
      const newKeyword = await this.keywordsService.createKeyword(body);
      return res.status(201).json(newKeyword);
    } catch (error) {
      return res.status(500).json('Server error');
    }
  }

  @Get('/:id')
  @Render('keywordDetails')
  async getKeywordDetails(@Req() req: Request, @Res() res: Response) {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    const keyword = await this.keywordsService.findById(req.params.id);

    return {
      keyword,
      tableColumns: scrapingResultTableSchema,
    };
  }

  @Get('/:id/delete')
  async deleteKeyword(@Req() req: Request, @Res() res: Response) {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    await this.keywordsService.delete(req.params.id);

    return res.redirect('/keywords');
  }
}
