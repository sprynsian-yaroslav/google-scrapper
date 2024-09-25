import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from './keywords.entity';
import {UpdateKeywordDto} from "./dto/update-keyword.dto";

@Injectable()
export class KeywordsService {
  constructor(
      @InjectRepository(Keyword)
      private keywordsRepository: Repository<Keyword>,
  ) {}

  async findAll({ search, limit, offset }: { search?: string; limit: number; offset: number }): Promise<[Keyword[], number]> {
    const query = this.keywordsRepository.createQueryBuilder('keyword');

    if (search) {
      query.where('keyword.keyword LIKE :search', { search: `%${search}%` });
    }

    query.skip(offset);
    query.take(limit);

    const [result, totalCount] = await query.getManyAndCount();

    return [result, totalCount];
  }

  findById(id: number): Promise<Keyword> {
    return this.keywordsRepository.findOneBy({ id })
  }

  create(keyword: Keyword): Promise<Keyword> {
    return this.keywordsRepository.save(keyword);
  }

  async remove(id: number): Promise<void> {
    await this.keywordsRepository.delete(id);
  }

  async update(id: number, updateKeywordDto: UpdateKeywordDto): Promise<Keyword> {
    const keyword = await this.findById(id);

    if (!keyword) {
      throw new NotFoundException(`Keyword with ID ${id} not found`);
    }

    console.log(updateKeywordDto)

    const updatedKeyword = { ...keyword, ...updateKeywordDto };

    console.log(updatedKeyword)

    return this.keywordsRepository.save(updatedKeyword);
  }
}
