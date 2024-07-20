import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Keyword } from '../../types/keyword/keyword.type';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectModel('Keywords') private readonly keywordModel: Model<Keyword>,
  ) {}

  async createKeyword(keyword: CreateKeywordDto): Promise<Keyword> {
    const newKeyword = new this.keywordModel(keyword);
    return newKeyword.save();
  }

  async findAll(): Promise<Keyword[]> {
    return this.keywordModel.find().populate('results').exec();
  }

  async findById(id: string): Promise<Keyword | null> {
    return this.keywordModel.findById(id).populate('results').exec();
  }

  async delete(id: string): Promise<Keyword | null> {
    const result = await this.keywordModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 1) {
      return { id } as Keyword;
    }
    return null;
  }

  updateKeywordResults(
    id: string,
    updateKeywordDto: UpdateKeywordDto,
  ): Promise<Keyword | null> {
    return this.keywordModel.findByIdAndUpdate(id, {
      $push: { results: { $each: updateKeywordDto.savedResultIds || [] } },
      ...updateKeywordDto,
    });
  }
}
