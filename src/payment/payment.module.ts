import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/user.repository';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { User } from 'src/entities/user.entity';
import { PaymentRepository } from './payment.repository';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';
import { EmailSenderRepository } from 'src/email-sender/email-sender.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
    }),
    UserModule,
    TypeOrmModule.forFeature([User, Payment]),
    EmailSenderModule,
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    UserRepository,
    EmailSenderRepository,
    {
      provide: Stripe,
      useFactory: (configService: ConfigService) => {
        const stripePrivateKey = configService.get('STRIPE_PRIVATE_KEY');
        return new Stripe(stripePrivateKey);
      },
      inject: [ConfigService],
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
