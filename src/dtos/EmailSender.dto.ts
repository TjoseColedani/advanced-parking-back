import { PickType } from '@nestjs/swagger';

export class EmailSenderDto {
  name: string;
  email: string;
  date: string;
  time: string;
  slot: string;
  parkingLot: string;
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
