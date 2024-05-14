import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserAuthDto,
  CreateUserDto,
  LoginUserDto,
} from 'src/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() body: LoginUserDto) {
    const { email, password } = body;
    return await this.authService.signin(email, password);
  }

  @Post('signin-auth0')
  async signinAuth(@Body() body: LoginUserDto) {
    const { email } = body;
    return await this.authService.signInAuth(email);
  }

  @Post('signup-auth0')
  async signUpAuth(@Body() user: CreateUserAuthDto) {
    return await this.authService.signUpAuth(user);
  }
  @Post('signup')
  async signup(@Body() user: CreateUserDto) {
    return await this.authService.signup(user);
  }
}
