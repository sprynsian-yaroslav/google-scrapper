import {Controller, Get, Post, Body, Param, Delete, UseGuards, Query} from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { Keyword } from './keywords.entity';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Get()
  async findAll(
      @Query('search') search: string,
      @Query('limit') limit = 10,
      @Query('offset') offset = 0,
  ): Promise<{ data: Keyword[], pagination: { totalCount: number, limit: number, offset: number } }> {
    const [data, totalCount] = await this.keywordsService.findAll({
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

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Keyword> {
    return this.keywordsService.findById(+id);
  }

  @Post()
  create(@Body() keyword: Keyword): Promise<Keyword> {
    return this.keywordsService.create(keyword);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.keywordsService.remove(+id);
  }
}
