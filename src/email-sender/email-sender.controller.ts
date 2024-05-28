import { Body, Controller, Post } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import {
  EmailSenderDto,
  RegisterSenderDto,
  UserFormSenderDto,
} from 'src/dtos/EmailSender.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('emails')
@Controller('email-sender')
export class EmailSenderController {
  constructor(private readonly emailSenderService: EmailSenderService) {}
  @Post('registered')
  @ApiOperation({summary: 'Send register email'})
  sendRegisterEmail(@Body() registerSenderDto: RegisterSenderDto) {
    return this.emailSenderService.sendRegisterEmail(registerSenderDto);
  }

  @Post('confirmed')
  @ApiOperation({summary: 'Send reservation confirmed email'})
  sendRervationConfirmedEmail(
    @Body()
    emailSenderDto: EmailSenderDto,
  ) {
    return this.emailSenderService.sendReservationConfirmationEmail(
      emailSenderDto,
    );
  }

  @Post('reminder-email')
  @ApiOperation({summary: 'Send reservation reminder email'})
  sendReservationReminderEmail(
    @Body()
    emailSenderDto: EmailSenderDto,
  ) {
    return this.emailSenderService.sendReservationReminderEmail(emailSenderDto);
  }

  @Post('schedule-reminder')
  @ApiOperation({summary: 'Send schedule reminder email'})
  scheduleReminderEmail(@Body() emailSenderDto: EmailSenderDto) {
    return this.emailSenderService.scheduleReminderEmail(emailSenderDto);
  }

  @Post('contact-form')
  @ApiOperation({summary: 'Send  user contact form email'})
  async sendUserContactForm(@Body() userFormSenderDto: UserFormSenderDto) {
    await this.emailSenderService.sendUserContactForm(userFormSenderDto);
    return 'Test notification email sent successfully';
  }
}
