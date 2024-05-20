import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailSenderDto, RegisterSenderDto } from 'src/dtos/EmailSender.dto';
import * as schedule from 'node-schedule';

@Injectable()
export class EmailSenderRepository {
  constructor(private emailSenderRepository: MailerService) {}

  async sendRegisterEmail(registerSenderDto: RegisterSenderDto) {
    await this.emailSenderRepository.sendMail({
      to: registerSenderDto.email,
      from: 'advancedparking.2024@gmail.com',
      subject: 'Register Confirmation',
      text: `Hello ${registerSenderDto.name}, thank you for registering with us! Your account is now active.
      Thank you for choosing us!
      Sincerely,
      Advanced Parking`,
      html: `<p>Hello ${registerSenderDto.name}, thank you for registering with us! Your account is now active.</p>
      <p>Thank you for choosing us!</p>
      <p>Sincerely,
      <br>Advanced Parking</p>,`,
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
    Advanced Parking`,
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

  async scheduleReminderEmail(emailSenderDto: EmailSenderDto) {
    const reservationTime = this.convertToDateTime(
      emailSenderDto.date,
      emailSenderDto.time,
    );
    console.log(reservationTime, 'reservation time');
    const reminderTime = new Date(reservationTime.getTime() - 1 * 60000);
    console.log(reminderTime, 'reminder time');

    schedule.scheduleJob(reminderTime, async () => {
      await this.sendReservationReminderEmail(emailSenderDto);
    });
  }

  private convertToDateTime(date: string, time: string): Date {
    const [day, month, year] = date
      .split('/')
      .map((part) => parseInt(part, 10));
    const [hours, minutes] = time.split(':').map((part) => parseInt(part, 10));
    return new Date(year, month - 1, day, hours, minutes);
  }
  async sendReservationReminderEmail(emailSenderDto: EmailSenderDto) {
    await this.emailSenderRepository.sendMail({
      to: emailSenderDto.email,
      from: 'advancedparking.2024@gmail.com',
      subject: 'Reminder of Parking Reservation',
      text: `Hello ${emailSenderDto.name}!

    This is a friendly reminder that you have a reservation in our parking lot for ${emailSenderDto.date} at ${emailSenderDto.time}.

    Thank you for choosing us!

    Sincerely,
    Advanced Parking`,
      html: `<p>Hello ${emailSenderDto.name}!</p>
    <p>This is a friendly reminder that you have a reservation in our parking lot for ${emailSenderDto.date} at ${emailSenderDto.time}.</p>
    <p>Thank you for choosing us!</p>
    <p>Sincerely,<br>Advanced Parking</p>`,
    });
  }
}
