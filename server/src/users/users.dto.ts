import { User } from './users.interfaces';
import {
  IsString,
  IsOptional,
  IsIn,
  IsDefined,
  ValidateNested,
} from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';

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

export class Sorting {
  @IsDefined()
  @IsString()
  @IsIn(['score'])
  orderBy: 'string';

  @IsDefined()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc';
}

export class GetUsersRequest {
  @ValidateNested()
  @IsOptional()
  @Type(() => Sorting)
  sorting?: Sorting;
}
