import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import axios from 'axios';
import { User } from './users.interfaces';
import { UserResponse } from './users.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly filePath = '../users.json';
  private users: User[] = [];
  private usersMap: Map<string, User> = new Map();

  constructor() {
    this.loadUsers();
  }

  async updateUser(user: User): Promise<void> {
    const { username } = user;
    if (this.usersMap.has(username)) {
      // Update existing user
      const existingUser = this.usersMap.get(username);
      const updatedUser = { ...existingUser, ...user };
      this.usersMap.set(username, updatedUser);
      this.users = Array.from(this.usersMap.values());
      this.saveUsers();
    } else {
      // If username doesn't exist, create a new user
      await this.createUser(user);
    }
  }

  async createUser(user: User): Promise<UserResponse> {
    await this.enrichUserData(user);
    this.users.push(user);
    this.usersMap.set(user.username, user);
    this.saveUsers();
    return user as UserResponse;
  }

  async getUsers(findOptions?: FindOptions): Promise<UserResponse[]> {
    if (findOptions?.sorting) {
      const { sortBy, sortDirection } = findOptions.sorting;
      return this.users
        .sort((a, b) =>
          sortDirection === 'asc'
            ? a[sortBy] > b[sortBy]
              ? 1
              : -1
            : a[sortBy] < b[sortBy]
              ? 1
              : -1,
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
        this.users.forEach((user) => this.usersMap.set(user.username, user));
      } else {
        this.logger.log(`File ${this.filePath} does not exist`);
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
    user.gender = gender || 'undetermined';
    if (gender) {
      const additionalData = await this.getAdditionalData(gender);
      user = {
        ...user,
        ...additionalData,
      };
    }
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

export class FindOptions {
  sorting?: Sorting;
}

export class Sorting {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}
