import { Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { EmailSenderController } from './email-sender.controller';
import { EmailSenderRepository } from './email-sender.repository';

@Module({
  imports: [],
  providers: [EmailSenderService, EmailSenderRepository],
  controllers: [EmailSenderController],
})
export class EmailSenderModule {}
