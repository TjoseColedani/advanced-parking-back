import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { config as dotenvConfig } from 'dotenv';
import { CreatePaymentDto } from 'src/dtos/payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PaymentRepository } from './payment.repository';
import { UserRepository } from 'src/user/user.repository';
import { Repository } from 'typeorm';

dotenvConfig({
  path: './.env.development',
});

const { STRIPE_PRIVATE_KEY, endpointSecret } = process.env;

@Injectable()
export class PaymentService {
  constructor(private stripe: Stripe,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly paymentRepository: PaymentRepository
  ) {
    this.stripe = new Stripe(STRIPE_PRIVATE_KEY);
  }

  async createSession(createPaymentDto: CreatePaymentDto) {
    const { type_of_service, unit_amount, appointment_id } = createPaymentDto;
    try {
      const session = await this.stripe.checkout.sessions.create({
        // recibir por body
        line_items: [
          {
            price_data: {
              product_data: {
                name: type_of_service,
              },
              currency: 'usd',
              unit_amount: unit_amount * 100,
            },
            quantity: 1,
          },
          {
            price_data: {
              product_data: {
                name: type_of_service,
              },
              currency: 'usd',
              unit_amount: unit_amount * 100,
            },
            quantity: 1,
          },
          {
            price_data: {
              product_data: {
                name: type_of_service,
              },
              currency: 'usd',
              unit_amount: unit_amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/success/${appointment_id}`, // <-- payment successful - front
        cancel_url: 'http://localhost:3000/cancel', // <-- couldn't process payment/cancellation - front
      });
      return { url: session.url, session: session };
    } catch (error) {
      return { message: error.message };
    }
  }

  async handlePayment(rawBody, requestNormal) {

  // Check if webhook signing is configured.
  if (endpointSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = requestNormal.headers["stripe-signature"];
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return "construction event failed";
    }

  if (event.data.object.status === "succeeded") {
    console.log(event.data.object);

    const emailDelPagador = event.data.object.billing_details.email;
    const amount_paid = event.data.object.amount / 100;
    const user = await this.userRepository.findOneBy({
      email: emailDelPagador,
    });;
    
    const type_of_service = "One time payment";
    await this.paymentRepository.createPayment(type_of_service, user, amount_paid)

    console.log(`🔔  Payment received!`);
  } else {
    console.log("There is no succeeded status")
    return {event: event.data.object}
  }

  
  
  }
}
}