import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse, GetUsersRequest } from './users.dto';
import { FindOptions } from './users.service';

@UsePipes(new ValidationPipe())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query() { sortBy, sortDirection }: GetUsersRequest,
  ): Promise<UserResponse[]> {
    const options: FindOptions = {
      sortBy: sortBy ?? 'score',
      sortDirection: sortDirection ?? 'desc',
    };

    return this.usersService.getUsers(options);
  }
}
