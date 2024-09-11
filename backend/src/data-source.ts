import { DataSource } from 'typeorm';
import { User } from './users/users.entity';
import { Keyword } from './keywords/keywords.entity';
import { ScrapingResult } from './scraping-results/scraping-result.entity';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [User, Keyword, ScrapingResult],
    synchronize: true,
    logging: true,
});