import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ScrapingResult } from '../scraping-results/scraping-result.entity';

@Entity()
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  keyword: string;

  @Column({ type: 'simple-array', nullable: true })
  contextWords: string[];

  @Column({ type: 'simple-array', nullable: true })
  excludeWords: string[];

  @Column({ nullable: true })
  siteFilter: string;

  @Column({ nullable: true })
  searchDate: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: false })
  isScheduled: boolean;

  @Column({ default: false })
  isCheck: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastCheckAt: Date;

  @OneToMany(() => ScrapingResult, scrapingResult => scrapingResult.keyword)
  scrapingResults: ScrapingResult[];
}