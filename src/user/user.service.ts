import { Injectable } from '@nestjs/common';
import {
  ResetPasswordDto,
  UpdateUserDto,
  UserEmailDto,
} from 'src/dtos/user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findAll() {
    return await this.userRepository.getAllUsers();
  }

  async findOne(id: string) {
    return await this.userRepository.getUserById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.updateUser(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.userRepository.deleteUser(id);
  }
  async createAdmin() {
    return await this.userRepository.createAdmin();
  }

  async requestPasswordReset(userEmailDto: UserEmailDto) {
    return await this.userRepository.requestPasswordReset(userEmailDto);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return await this.userRepository.resetPassword(resetPasswordDto);
  }
}
