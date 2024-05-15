export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: number;
}
export class CreateUserAuthDto {
  name: string;
  email: string;
  image: string;
}

export class UpdateUserDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: number;
}

export class LoginUserDto {
  email: string;
  password: string;
}
