import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse, GetUsersRequest } from './users.dto';
import { FindOptions } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query() request: GetUsersRequest): Promise<UserResponse[]> {
    // todo - add transformation of request to FindOptions
    const options: FindOptions = {
      orderBy: request.sorting?.orderBy,
      sortOrder: request.sorting?.sortOrder,
    };

    return this.usersService.getUsers(options);
  }
}
