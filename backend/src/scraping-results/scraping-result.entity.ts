import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Keyword } from '../keywords/keywords.entity';

@Entity()
export class ScrapingResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @Column()
  text: string;

  @ManyToOne(() => Keyword, keyword => keyword.scrapingResults)
  keyword: Keyword;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('text', { nullable: true })
  aiContext: string | null;
}
