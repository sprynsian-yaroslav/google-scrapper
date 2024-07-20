import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import puppeteer from 'puppeteer';
import { ScrapingResult } from '../../types/scraping-result/scraping-result.type';
import { KeywordsService } from '../keywords/keywords.service';
import { Keyword } from '../../types/keyword/keyword.type';
import { CronService } from '../cron/cron.service';

@Injectable()
export class ScrapingResultsService {
  private readonly MAX_TEXT_LENGTH = 150;
  private readonly CONTEXT_LENGTH = 300;
  private readonly GOOGLE_SEARCH_URL = 'https://www.google.com/search';
  private readonly USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  private readonly PUPPETEER_OPTIONS = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  };
  private readonly TAG_TYPES = [
    'p',
    'div',
    'span',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'section',
  ];

  constructor(
    private keywordService: KeywordsService,
    private cronService: CronService,
    @InjectModel('ScrapingResults')
    private scrapingResultModel: Model<ScrapingResult>,
  ) {}

  async scrapeGoogle(keywordId: string): Promise<void> {
    const keyword = await this.keywordService.findById(keywordId);

    if (!keyword) {
      throw new Error('Keyword not found');
    }

    await this.keywordService.updateKeywordResults(keywordId, {
      isCheck: true,
    });

    const browser = await puppeteer.launch(this.PUPPETEER_OPTIONS);

    let allLinks = [];
    for (let pageNumber = 1; pageNumber <= 1; pageNumber++) {
      const page = await browser.newPage();
      const searchUrl = this.constructSearchUrl(keyword.keyword, pageNumber);
      await page.goto(searchUrl, { waitUntil: 'load' });

      const linksOnPage = await page.$$eval('a', (anchors) => {
        return anchors
          .filter((anchor) => anchor.querySelector('h3'))
          .map((anchor) => anchor.href)
          .filter((href) => {
            return href.startsWith('http') && !href.includes('google.com');
          });
      });
      allLinks = allLinks.concat(linksOnPage);
      await page.close();
    }

    const savedResultsIds = [];
    for (const link of allLinks) {
      const page = await browser.newPage();
      try {
        await page.setUserAgent(this.USER_AGENT);
        await page.goto(link, { waitUntil: 'networkidle2' });

        const xpathQuery = this.constructXPathQuery(keyword.keyword);
        const elementsWithKeyword = await page.$x(xpathQuery);

        for (const element of elementsWithKeyword) {
          try {
            const fullText = await page.evaluate(
              (el) => el.textContent,
              element,
            );
            const sentence = this.extractContext(fullText, keyword.keyword);
            if (sentence) {
              const encodedText = encodeURIComponent(sentence);
              const fragmentURL = `${link}#:~:text=${encodedText}`;

              const result = await this.saveScrapingResult({
                link: fragmentURL,
                keyword: keyword.id,
                text: sentence,
              });

              if (result) {
                savedResultsIds.push(result.id);
              }
            }
          } catch (e) {
            console.error(`${link} not loaded`);
            console.error(e);
            continue;
          }
        }
        await page.close();
      } catch (e) {
        await page.close();
        console.error(`${link} not loaded 2`);
        console.log(e);
        continue;
      }
    }

    await browser.close();

    if (savedResultsIds.length > 0) {
      await this.keywordService.updateKeywordResults(keyword.id, {
        savedResultIds: savedResultsIds,
        isCheck: false,
        lastCheckAt: new Date(),
      });
    }
  }

  private async saveScrapingResult({
    link,
    keyword,
    text,
  }): Promise<ScrapingResult | null> {
    const existingResult = await this.scrapingResultModel.findOne({
      text,
      keyword,
    });
    if (existingResult) {
      return null;
    }

    const scrapingResult = new this.scrapingResultModel({
      link,
      keyword,
      text,
    });
    return await scrapingResult.save();
  }

  private extractContext(text: string, keyword: string): string {
    const keywordLower = keyword.toLowerCase();
    const textLower = text.toLowerCase();

    const keywordIndex = textLower.indexOf(keywordLower);
    if (keywordIndex === -1) return '';

    const start = Math.max(0, keywordIndex - this.MAX_TEXT_LENGTH);
    const end = Math.min(
      text.length,
      keywordIndex + keyword.length + this.MAX_TEXT_LENGTH,
    );

    let context = text.substring(start, end).trim();

    if (context.length > this.CONTEXT_LENGTH) {
      const nearestSpaceBefore = context.lastIndexOf(' ', this.MAX_TEXT_LENGTH);
      const nearestSpaceAfter = context.indexOf(
        ' ',
        context.length - this.MAX_TEXT_LENGTH,
      );

      const startTrim = nearestSpaceBefore > 0 ? nearestSpaceBefore : 0;
      const endTrim =
        nearestSpaceAfter >= 0 ? nearestSpaceAfter : context.length;

      context = context.substring(startTrim, endTrim).trim();
    }

    return context;
  }

  private constructSearchUrl(keyword: string, pageNumber: number): string {
    return `${this.GOOGLE_SEARCH_URL}?q=${encodeURIComponent(keyword)}&start=${
      (pageNumber - 1) * 10
    }`;
  }

  private constructXPathQuery(keyword: string): string {
    const lowercaseKeyword = keyword.toLowerCase();
    return this.TAG_TYPES.map(
      (tag) =>
        `//${tag}[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${lowercaseKeyword}')]`,
    ).join(' | ');
  }

  async updateScheduledStatus(
    id: string,
    isScheduled: boolean,
    action: () => void,
  ): Promise<Keyword> {
    const updatedKeyword = await this.keywordService.findById(id);

    if (isScheduled) {
      this.cronService.startTask(updatedKeyword, action);
    } else {
      this.cronService.stopTask(id);
    }

    console.log('isScheduled', isScheduled);

    return this.keywordService.updateKeywordResults(id, { isScheduled });
  }
}
