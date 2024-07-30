import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GameResult } from './game.interfaces';

@Injectable()
export class GameService {
  constructor(private readonly usersService: UsersService) {}

  async addGameResult(gameResult: GameResult) {
    const { username, fullName, score } = gameResult;
    return this.usersService.updateUser({ username, fullName, score });
  }
}
