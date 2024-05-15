import { Body, Controller, Post } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';

@Controller('email-sender')
export class EmailSenderController {
  constructor(private readonly emailSenderService: EmailSenderService) {}
  @Post('registered')
  sendRegisterEmail(@Body() data: { name: string; email: string }) {
    const { name, email } = data;
    return this.emailSenderService.sendRegisterEmail(name, email);
  }
}
