import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindOptions, UsersService } from './users.service';
import { UserResponse, GetUsersRequest } from './users.dto';

@UsePipes(new ValidationPipe())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query() { sorting }: GetUsersRequest,
  ): Promise<UserResponse[]> {
    console.log('sorting', sorting);
    const options: FindOptions = {
      sorting: sorting ?? {
        sortBy: 'score',
        sortDirection: 'desc',
      },
    };

    return this.usersService.getUsers(options);
  }
}
