import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { User } from './users.interfaces';
import { UserResponse } from './users.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly filePath = path.resolve(__dirname, '../users.json');
  private users: User[] = [];

  constructor() {
    this.loadUsers();
  }

  async updateUser(user: User): Promise<void> {
    const { username } = user;
    let existingUser = this.users.find((user) => user.username === username);

    if (existingUser) {
      // make sure user is updated with new data
      existingUser = {
        ...existingUser,
        ...user,
      };
    } else {
      await this.createUser(user);
    }
  }

  async createUser(user: User): Promise<UserResponse> {
    await this.enrichUserData(user);
    this.users.push(user);
    this.saveUsers();
    return user as UserResponse;
  }

  async getUsers({ orderBy, sortOrder }: FindOptions): Promise<UserResponse[]> {
    if (orderBy === 'score') {
      return this.users
        .sort((a, b) =>
          sortOrder === 'asc' ? a.score - b.score : b.score - a.score,
        )
        .map((user) => user as UserResponse);
    }
    return this.users.map((user) => user as UserResponse);
  }

  private loadUsers() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.users = JSON.parse(data);
    }
  }

  private saveUsers() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.users, null, 2));
  }

  private async enrichUserData(user: User): Promise<void> {
    const gender = await this.getGender(user.fullName);
    user.gender = gender;
    // todo - only if gender is detrermined add aditional data
    // todo - think of hoe to represent the avatar
    const additionalData = await this.getAdditionalData(gender);
    user.avatar = additionalData.avatar;
    user.country = additionalData.country;
    user.phone = additionalData.phone;
  }

  private async getGender(fullname: string): Promise<string> {
    try {
      const response = await axios.get(
        `https://api.genderize.io?name=${fullname}`,
      );
      if (response.data.probability > 0.95) {
        return response.data.gender;
      }
    } catch (error) {
      this.logger.error('Error fetching gender:', error);
    }
    return 'undetermined';
  }

  private async getAdditionalData(gender: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://randomuser.me/api/?gender=${gender}`,
      );
      const user = response.data.results[0];
      return {
        avatar: user.picture.large,
        country: user.location.country,
        phone: user.phone,
      };
    } catch (error) {
      this.logger.error('Error fetching additional data:', error);
      return {};
    }
  }
}

export interface FindOptions {
  orderBy?: string;
  sortOrder?: 'asc' | 'desc';
}
