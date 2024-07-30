import { IsString, IsNumber, Min } from '@nestjs/class-validator';
import { GameResult } from './game.interfaces';

export class AddGameResultRequest implements GameResult {
  @IsString()
  username: string;

  @IsString()
  fullName: string;

  @IsNumber()
  @Min(0)
  score: number;
}
