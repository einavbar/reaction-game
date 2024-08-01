import { User } from './users.interfaces';
import {
  IsString,
  IsOptional,
  IsIn,
  ValidateNested,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class UserResponse implements User {
  username: string;
  fullName: string;
  score: number;
  gender?: string;
  avatar?: string;
  country?: string;
  phone?: string;
}

export class Sorting {
  @IsString()
  @IsIn(['score'])
  sortBy: string;

  @IsString()
  @IsIn(['asc', 'desc'])
  sortDirection: 'asc' | 'desc';
}

export class GetUsersRequest {
  @IsOptional()
  @ValidateNested()
  @Type(() => Sorting)
  sorting: Sorting;
}
