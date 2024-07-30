import { User } from './users.interfaces';
import { IsString, IsOptional, IsIn } from '@nestjs/class-validator';

export class UserResponse implements User {
  username: string;
  fullName: string;
  score: number;
  gender?: string;
  //todo think about avatar
  avatar?: string;
  country?: string;
  phone?: string;
}

export class GetUsersRequest {
  @IsOptional()
  @IsString()
  @IsIn(['score'])
  sortBy: 'string';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortDirection: 'asc' | 'desc';
}
