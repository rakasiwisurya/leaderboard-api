import { IsInt, IsString, Min } from 'class-validator';

export class CreateScoreDto {
  @IsString()
  username: string;

  @IsInt()
  @Min(0)
  score: number;
}
