import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailSenderDto, RegisterSenderDto } from 'src/dtos/EmailSender.dto';

@Injectable()
export class EmailSenderRepository {
  constructor(private emailSenderRepository: MailerService) {}

  async sendRegisterEmail(registerSenderDto: RegisterSenderDto) {
    await this.emailSenderRepository.sendMail({
      to: registerSenderDto.email,
      from: 'advancedparking.2024@gmail.com',
      subject: 'Testing Email Sender',
      text: `Hello ${registerSenderDto.name}, this is a test email.`,
      html: `<p>Hello ${registerSenderDto.name}, this is a test email in HTML.</p>`,
    });

    return 'Email sent successfully';
  }

  async sendReservationConfirmationEmail(emailSenderDto: EmailSenderDto) {
    await this.emailSenderRepository.sendMail({
      to: emailSenderDto.email,
      from: 'advancedparking.2024@gmail.com',
      subject: 'Confirmation of Parking Reservation',
      text: `Hello ${emailSenderDto.name}, your parking reservation has been confirmed. Here are the details:
    - Date: ${emailSenderDto.date}
    - Time: ${emailSenderDto.time}
    - Slot: ${emailSenderDto.slot}
    - Parking Lot: ${emailSenderDto.parkingLot}
    - Location: ${emailSenderDto.location}

    Thank you for choosing us!
    Sincerely,
    Parking Name`,
      html: `<p>Hello ${emailSenderDto.name}, your parking reservation has been confirmed. Here are the details:</p>
    <ul>
      <li>Date: ${emailSenderDto.date}</li>
      <li>Time: ${emailSenderDto.time}</li>
      <li>Slot: ${emailSenderDto.slot}</li>
      <li>Parking Lot: ${emailSenderDto.parkingLot}</li>
      <li>Location: ${emailSenderDto.location}</li>
    </ul>
    <p>Thank you for choosing us!</p>
    <p>Sincerely,<br>Advanced Parking</p>`,
    });
  }

  async sendReservationReminderEmail(emailSenderDto: EmailSenderDto) {
    await this.emailSenderRepository.sendMail({
      to: emailSenderDto.email,
      from: 'advancedparking.2024@gmail.com',
      subject: 'Reminder of Parking Reservation',
      text: `Hello ${emailSenderDto.name}!

    This is a friendly reminder that you have a reservation in our parking lot for ${emailSenderDto.date} at ${emailSenderDto.time}.

    Don't forget to come!

    Sincerely,
    Parking Name (booking reminder)`,
      html: `<p>Hello ${emailSenderDto.name}!</p>
    <p>This is a friendly reminder that you have a reservation in our parking lot for ${emailSenderDto.date} at ${emailSenderDto.time}.</p>
    <p>Don't forget to come!</p>
    <p>Sincerely,<br>Advanced Parking</p>`,
    });
  }
}
