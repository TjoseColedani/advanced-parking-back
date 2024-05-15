import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailSenderRepository {
  constructor(private emailSenderRepository: MailerService) {}

  async sendRegisterEmail(name: string, email: string) {
    await this.emailSenderRepository.sendMail({
      to: email,
      from: 'mariogutierreztello@gmail.com',
      subject: 'Testing Email Sender',
      text: `Hello ${name}, this is a test email.`,
      html: `<p>Hello ${name}, this is a test email in HTML.</p>`,
    });

    return 'Email sent successfully';
  }
}
