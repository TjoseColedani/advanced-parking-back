import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/user.dto';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(user: CreateUserDto) {
    const userFound = await this.usersRepository.getUserByEmail(user.email);
    if (userFound) throw new BadRequestException('User already exists');
    if (user.password !== user.confirmPassword)
      throw new BadRequestException('passwords do not match');

    const hashedPassword = await bcrypt.hash(user.password, 10);
    if (!hashedPassword)
      throw new BadRequestException('password could not be hashed');

    const createdUser = await this.usersRepository.createUser({
      ...user,
      password: hashedPassword,
    });

    return createdUser;
  }

  async signin(email: string, password: string) {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) throw new UnauthorizedException('invalid credentials');

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      throw new UnauthorizedException('invalid credentials');

    const userPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(userPayload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userpassword, ...userData } = user;

    return {
      message: 'Logged in successfully',
      token,
      userData,
    };
  }
}
