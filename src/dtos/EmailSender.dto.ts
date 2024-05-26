import { PickType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EmailSenderDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  date: string;
  @IsString()
  time: string;
  @IsString()
  @IsOptional()
  slot: string;
  @IsString()
  parkingLot: string;
  @IsString()
  location: string;
}

export class RegisterSenderDto extends PickType(EmailSenderDto, [
  'name',
  'email',
]) {}

export class ReminderSenderDto extends PickType(EmailSenderDto, [
  'name',
  'email',
  'date',
  'time',
]) {}

export class UserFormSenderDto {
  @IsString()
  user_name: string;
  @IsEmail()
  user_email: string;
  @IsString()
  user_message: string;
}
