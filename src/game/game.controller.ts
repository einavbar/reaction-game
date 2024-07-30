import { Controller, Post, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { AddGameResultRequest } from './game.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('result')
  async postGameResult(@Body() request: AddGameResultRequest) {
    return this.gameService.addGameResult(request);
  }
}
