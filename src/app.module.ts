import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [],
  controllers: [AppController, GameController, UsersController],
  providers: [AppService, GameService, UsersService],
})
export class AppModule {}
