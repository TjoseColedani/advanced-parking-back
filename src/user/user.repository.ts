import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (!users.length) throw new BadRequestException('Error to get users');
    return users;
  }
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'phone'],
      relations: { appointments: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email,
      status: 'active',
    });
    return user;
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const newUser = new User();
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.phone = user.phone;
    newUser.status = 'active';
    await this.userRepository.save(newUser);
    const createdUser = await this.userRepository.findOne({
      where: { email: newUser.email },
      select: ['id', 'name', 'email', 'phone'],
    });

    return createdUser;
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!foundUser) throw new NotFoundException('User not found');
    await this.userRepository.update(id, user);
    return await this.userRepository.findOne({
      where: { id },
    });
  }
  async deleteUser(id: string): Promise<string> {
    const foundUser = await this.userRepository.findOne({
      where: { id, status: 'active' },
    });
    if (!foundUser) throw new NotFoundException('User not found');
    await this.userRepository.update(id, { status: 'deleted' });
    return 'User with ID ' + id + ' deleted successfully';
  }
}
