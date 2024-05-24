import { Body, Controller, Post } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import {
  EmailSenderDto,
  RegisterSenderDto,
  UserFormSenderDto,
} from 'src/dtos/EmailSender.dto';

@Controller('email-sender')
export class EmailSenderController {
  constructor(private readonly emailSenderService: EmailSenderService) {}
  @Post('registered')
  sendRegisterEmail(@Body() registerSenderDto: RegisterSenderDto) {
    return this.emailSenderService.sendRegisterEmail(registerSenderDto);
  }

  @Post('confirmed')
  sendRervationConfirmedEmail(
    @Body()
    emailSenderDto: EmailSenderDto,
  ) {
    return this.emailSenderService.sendReservationConfirmationEmail(
      emailSenderDto,
    );
  }

  @Post('reminder-email')
  sendReservationReminderEmail(
    @Body()
    emailSenderDto: EmailSenderDto,
  ) {
    return this.emailSenderService.sendReservationReminderEmail(emailSenderDto);
  }

  @Post('schedule-reminder')
  scheduleReminderEmail(@Body() emailSenderDto: EmailSenderDto) {
    return this.emailSenderService.scheduleReminderEmail(emailSenderDto);
  }

  @Post('contact-form')
  async sendUserContactForm(@Body() userFormSenderDto: UserFormSenderDto) {
    await this.emailSenderService.sendUserContactForm(userFormSenderDto);
    return 'Test notification email sent successfully';
  }
}
