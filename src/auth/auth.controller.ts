import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserAuthDto,
  CreateUserDto,
  LoginUserDto,
  UpdatePasswordDto,
} from 'src/dtos/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Sign in using email and password' })
  async signin(@Body() body: LoginUserDto) {
    const { email, password } = body;
    return await this.authService.signin(email, password);
  }

  @Post('signin-auth0')
  @ApiOperation({ summary: 'Sign in using third party auth' })
  async signinAuth(@Body() body: LoginUserDto) {
    const { email } = body;
    return await this.authService.signInAuth(email);
  }

  @Post('signup-auth0')
  @ApiOperation({ summary: 'Sign up using third party auth' })
  async signUpAuth(@Body() user: CreateUserAuthDto) {
    return await this.authService.signUpAuth(user);
  }
  @Post('signup')
  @ApiOperation({ summary: 'Sign up entering your own data' })
  async signup(@Body() user: CreateUserDto) {
    return await this.authService.signup(user);
  }

  @Put('update-password')
  @ApiOperation({ summary: 'Update your password' })
  async updatePassword(@Body() updatePassword: UpdatePasswordDto) {
    return await this.authService.updatePassword(updatePassword);
  }
}
