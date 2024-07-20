import { ScrapingResult } from '../scraping-result/scraping-result.type';

export type Keyword = {
  id?: string;
  keyword: string;
  results: ScrapingResult[];
  isScheduled: boolean;
  isCheck: boolean;
  lastCheckAt: Date;
  createdAt: Date;
};