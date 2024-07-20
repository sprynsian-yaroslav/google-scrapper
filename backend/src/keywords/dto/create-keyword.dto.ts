import { IsNotEmpty, IsString } from 'class-validator';

export class CreateKeywordDto {
  @IsString()
  @IsNotEmpty()
  readonly keyword: string;
}