import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserDto,
  ResetPasswordDto,
  UpdateUserDto,
  UserEmailDto,
} from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/enums/roles.enum';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmailSenderRepository } from 'src/email-sender/email-sender.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailSenderRepository: EmailSenderRepository,
  ) {}
  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (!users.length) throw new BadRequestException('Users not found');
    return users;
  }
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'phone', 'image', 'status', 'role'],
      relations: { appointments: { parking_lot: true } },
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

  async createUserAuth(user: User) {
    const newUser = await this.userRepository.save(user);
    return this.userRepository.findOne({
      where: { id: newUser.id },
      select: ['id', 'name', 'email', 'phone', 'image', 'role'],
    });
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
  async createAdmin(): Promise<User> {
    const hashedPassword = await bcrypt.hash('A.p.2024', 10);
    const emailAdmin = 'advancedparking.2024@gmail.com';

    const oldUserAdmin = await this.userRepository.findOne({
      where: { email: emailAdmin },
    });
    if (oldUserAdmin) throw new BadRequestException('User already exists');

    const newUser = new User();
    newUser.name = 'Usuario Administrador';
    newUser.email = emailAdmin;
    newUser.password = hashedPassword;
    newUser.phone = 1112345678;
    newUser.status = 'active';
    newUser.role = Role.Admin;
    await this.userRepository.save(newUser);
    const createdUser = await this.userRepository.findOne({
      where: { email: newUser.email },
      select: ['id', 'name', 'email', 'phone', 'role'],
    });

    return createdUser;
  }

  async requestPasswordReset(userEmailDto: UserEmailDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: userEmailDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '1h' },
    );

    const resetLink = `https://advanced-parking.vercel.app/newpassword/${token}`;

    await this.emailSenderRepository.sendPasswordResetEmail(
      resetLink,
      user.email,
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;
    let payload;
    console.log(payload);
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }
}
