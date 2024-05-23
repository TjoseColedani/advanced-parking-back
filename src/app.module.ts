import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import databaseConfig from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ParkingLotModule } from './parking-lot/parking-lot.module';
import { PaymentModule } from './payment/payment.module';
import { SlotModule } from './slot/slot.module';
import { AppointmentModule } from './appointments/appointments.module';
import { mailerConfig } from './config/mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5h' },
    }),
    MailerModule.forRoot(mailerConfig()),
    UserModule,
    AuthModule,
    ParkingLotModule,
    PaymentModule,
    SlotModule,
    AppointmentModule,
    EmailSenderModule,
    FileUploadModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly schedulerService: SchedulerService) {}

  onModuleInit() {
    this.schedulerService.handleCron();
  }
}
