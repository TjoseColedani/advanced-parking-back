import { Injectable } from '@nestjs/common';
import { EmailSenderRepository } from './email-sender.repository';
import {
  EmailSenderDto,
  RegisterSenderDto,
  UserFormSenderDto,
} from 'src/dtos/EmailSender.dto';

@Injectable()
export class EmailSenderService {
  constructor(private readonly emailSenderRepository: EmailSenderRepository) {}

  sendRegisterEmail(registerSenderDto: RegisterSenderDto) {
    return this.emailSenderRepository.sendRegisterEmail(registerSenderDto);
  }
  sendReservationConfirmationEmail(emailSenderDto: EmailSenderDto) {
    return this.emailSenderRepository.sendReservationConfirmationEmail(
      emailSenderDto,
    );
  }

  sendReservationReminderEmail(emailSenderDto: EmailSenderDto) {
    return this.emailSenderRepository.sendReservationReminderEmail(
      emailSenderDto,
    );
  }
  scheduleReminderEmail(emailSenderDto: EmailSenderDto) {
    return this.emailSenderRepository.scheduleReminderEmail(emailSenderDto);
  }

  sendUserContactForm(userFormSenderDto: UserFormSenderDto) {
    return this.emailSenderRepository.sendUserContactForm(userFormSenderDto);
  }
}
