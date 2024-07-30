import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GameService } from './game.service';
import { AddGameResultRequest } from './game.dto';

@UsePipes(new ValidationPipe())
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('result')
  async postGameResult(@Body() request: AddGameResultRequest) {
    return this.gameService.addGameResult(request);
  }
}
