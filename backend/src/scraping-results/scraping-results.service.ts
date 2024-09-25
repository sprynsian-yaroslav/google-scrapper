import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import puppeteer, { Browser, Page } from 'puppeteer';
import { ScrapingResult } from './scraping-result.entity';
import { KeywordsService } from '../keywords/keywords.service';
import { Keyword } from '../keywords/keywords.entity';
import {AIService} from "../ai/ai.service";

@Injectable()
export class ScrapingResultsService {
    private readonly MAX_TEXT_LENGTH = 150;
    private readonly CONTEXT_LENGTH = 300;
    private readonly GOOGLE_SEARCH_URL = 'https://www.google.com/search';
    private readonly USER_AGENT =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    private readonly PUPPETEER_OPTIONS = {
        headless: "new" as "new",
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

    private browser: Browser | null = null;

    constructor(
        private keywordService: KeywordsService,
        @InjectRepository(ScrapingResult)
        private scrapingResultsRepository: Repository<ScrapingResult>,
        private aiService: AIService,
    ) {}

    async scrapeGoogle(keywordId: number): Promise<void> {
        console.log("Start scraping");
        const keyword = await this.keywordService.findById(keywordId);

        if (!keyword) {
            throw new Error('Keyword not found');
        }

        console.log("2");

        this.browser = await puppeteer.launch(this.PUPPETEER_OPTIONS);

        try {
            let allLinks = [];

            for (let pageNumber = 1; pageNumber <= 7; pageNumber++) {
                const searchUrl = this.constructSearchUrl(keyword, pageNumber);
                const page = await this.browser.newPage();
                await page.goto(searchUrl, { waitUntil: 'load' });

                const linksOnPage = await page.$$eval('a', (anchors) => {
                    return anchors
                        .filter((anchor) => anchor.querySelector('h3'))
                        .map((anchor) => anchor.href)
                        .filter((href) => href.startsWith('http') && !href.includes('google.com'));
                });

                allLinks = allLinks.concat(linksOnPage);
                await page.close(); // Закриваємо сторінку після завершення збору посилань
            }

            console.log("allLinks: ", allLinks);

            await this.processLinks(allLinks, keyword);

            console.log("Finish scraping");

            await this.keywordService.update(keyword.id, {
                isCheck: false,
                lastCheckAt: new Date(),
            });

        } catch (error) {
            console.error('Scraping failed:', error);
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }

    private async processLinks(allLinks: string[], keyword: Keyword): Promise<void> {
        for (const link of allLinks) {
            let page: Page | null = null;
            try {
                if (!this.browser) {
                    throw new Error("Browser is not initialized.");
                }

                page = await this.browser.newPage();
                await page.goto('about:blank');
                await page.setUserAgent(this.USER_AGENT);
                await page.goto(link, { waitUntil: 'networkidle2' });

                const xpathQuery = this.constructXPathQuery(keyword.keyword);
                const pageContent = await page.content();
                const elementsWithKeyword = await page.$x(xpathQuery);

                const prompt = AIService.generateGetContextByKeywordsPrompt(keyword.keyword, pageContent);
                const aiContext = await this.aiService.analyzeContext(prompt);

                for (const element of elementsWithKeyword) {
                    const fullText = await page.evaluate(el => el.textContent, element);
                    const sentence = this.extractContext(fullText, keyword.keyword);
                    if (sentence) {
                        const encodedText = encodeURIComponent(sentence);
                        const fragmentURL = `${link}#:~:text=${encodedText}`;

                        await this.saveScrapingResult({
                            link: fragmentURL,
                            keyword,
                            text: sentence,
                            aiContext: aiContext
                        });
                    }
                }
            } catch (e) {
                console.error(`${link} not loaded`, e);
            } finally {
                if (page) {
                    await page.close();
                }
            }
        }
    }

    private async saveScrapingResult({
                                         link,
                                         keyword,
                                         text,
                                         aiContext,
                                     }: {
        link: string;
        keyword: Keyword;
        text: string;
        aiContext: string;
    }): Promise<ScrapingResult | null> {

        const existingResult = await this.scrapingResultsRepository.findOne({
            where: { text, keyword },
        });
        if (existingResult) {
            return null;
        }


        const scrapingResult = this.scrapingResultsRepository.create({
            link,
            keyword,
            text,
            aiContext
        });

        console.log("Save scraping result", { link, keyword, text, aiContext });

        return this.scrapingResultsRepository.save(scrapingResult);
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

    private constructSearchUrl(keywordEntity: Keyword, pageNumber: number): string {
        let query = keywordEntity.keyword;

        if (keywordEntity.contextWords && keywordEntity.contextWords.length > 0) {
            query += ` ${keywordEntity.contextWords.map(word => `"${word}"`).join(' ')}`;
        }

        if (keywordEntity.excludeWords && keywordEntity.excludeWords.length > 0) {
            query += ` ${keywordEntity.excludeWords.map(word => `-${word}`).join(' ')}`;
        }

        if (keywordEntity.siteFilter) {
            query += ` site:${keywordEntity.siteFilter}`;
        }

        if (keywordEntity.searchDate) {
            query += ` after:${keywordEntity.searchDate}-01-01 before:${keywordEntity.searchDate}-12-31`;
        }

        return `${this.GOOGLE_SEARCH_URL}?q=${encodeURIComponent(query)}&start=${(pageNumber - 1) * 10}`;
    }


    private constructXPathQuery(keyword: string): string {
        const lowercaseKeyword = keyword.toLowerCase();
        return this.TAG_TYPES.map(
            (tag) =>
                `//${tag}[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${lowercaseKeyword}')]`,
        ).join(' | ');
    }

    async findByKeywordId({
                              keywordId,
                              search,
                              limit,
                              offset,
                          }: {
        keywordId: number;
        search?: string;
        limit: number;
        offset: number;
    }): Promise<[ScrapingResult[], number]> {
        const query = this.scrapingResultsRepository.createQueryBuilder('scrapingResult')
            .leftJoinAndSelect('scrapingResult.keyword', 'keyword')
            .where('keyword.id = :keywordId', { keywordId });

        if (search) {
            query.andWhere('scrapingResult.text LIKE :search', { search: `%${search}%` });
        }

        query.skip(offset);
        query.take(limit);

        const [result, totalCount] = await query.getManyAndCount();

        return [result, totalCount];
    }

    create(scrapingResult: ScrapingResult): Promise<ScrapingResult> {
        return this.scrapingResultsRepository.save(scrapingResult);
    }

    async remove(id: number): Promise<void> {
        await this.scrapingResultsRepository.delete(id);
    }
}
