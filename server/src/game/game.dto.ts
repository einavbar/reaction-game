import { IsString, IsNumber, Min, IsDefined } from '@nestjs/class-validator';
import { GameResult } from './game.interfaces';

export class AddGameResultRequest implements GameResult {
  @IsString()
  @IsDefined()
  username: string;

  @IsString()
  @IsDefined()
  fullName: string;

  @IsNumber()
  @Min(0)
  @IsDefined()
  score: number;
}
