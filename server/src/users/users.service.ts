import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import axios from 'axios';
import { User } from './users.interfaces';
import { UserResponse } from './users.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly filePath = '../users.json';
  private users: User[];

  constructor() {
    this.loadUsers();
  }

  async updateUser(user: User): Promise<void> {
    const { username } = user;
    const existingUserIndex = this.users.findIndex(
      (u) => u.username === username,
    );
    console.log('existingUserIndex', existingUserIndex);
    if (existingUserIndex !== -1) {
      // Update existing user
      this.users[existingUserIndex] = {
        ...this.users[existingUserIndex],
        ...user,
      };
      this.saveUsers();
    } else {
      // If user doesn't exist, create a new one
      await this.createUser(user);
    }
  }

  async createUser(user: User): Promise<UserResponse> {
    await this.enrichUserData(user);
    this.users.push(user);
    this.saveUsers();
    return user as UserResponse;
  }

  async getUsers({
    sortBy,
    sortDirection,
  }: FindOptions): Promise<UserResponse[]> {
    this.logger.log(`Sorting users by ${sortBy} in ${sortDirection} order`);
    if (sortBy === 'score') {
      return this.users
        .sort((a, b) =>
          sortDirection === 'asc' ? a.score - b.score : b.score - a.score,
        )
        .map((user) => user as UserResponse);
    }
    return this.users.map((user) => user as UserResponse);
  }

  private loadUsers() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        this.users = JSON.parse(data);
      } else {
        this.logger.log(`File ${this.filePath} does not exist. Creating file.`);
        this.users = [];
        this.saveUsers();
      }
    } catch (error) {
      this.logger.error('Error loading users:', error);
    }
  }

  private saveUsers() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.users, null, 2));
  }

  private async enrichUserData(user: User): Promise<void> {
    const gender = await this.getGender(user.fullName);
    // todo - think of hoe to represent the avatar
    if (gender) {
      const additionalData = await this.getAdditionalData(gender);
      user.gender = gender;
      user.avatar = additionalData.avatar;
      user.country = additionalData.country;
      user.phone = additionalData.phone;
    } else {
      user.gender = 'undetermined';
    }
  }

  private async getGender(fullname: string): Promise<string> {
    try {
      const response = await axios.get(
        `https://api.genderize.io?name=${fullname}`,
      );
      console.log(response.data.gender, response.data.probability);
      if (response.data.probability > 0.95) {
        return response.data.gender;
      }
    } catch (error) {
      this.logger.error('Error fetching gender:', error);
    }
    return undefined;
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
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
