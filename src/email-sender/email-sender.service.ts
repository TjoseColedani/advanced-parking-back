import { Injectable } from '@nestjs/common';
import { EmailSenderRepository } from './email-sender.repository';

@Injectable()
export class EmailSenderService {
  constructor(private readonly emailSenderRepository: EmailSenderRepository) {}

  sendRegisterEmail(name: string, email: string) {
    return this.emailSenderRepository.sendRegisterEmail(name, email);
  }
}
