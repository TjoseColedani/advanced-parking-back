import { MailerOptions } from '@nestjs-modules/mailer';

export function mailerConfig(): MailerOptions {
  return {
    transport: {
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
  };
}
