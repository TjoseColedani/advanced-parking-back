import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'], 
    }),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
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
