import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { config as dotenvConfig } from 'dotenv';
import { CreatePaymentDto } from 'src/dtos/payment.dto';

dotenvConfig({
  path: './.env.development',
});

const { STRIPE_PRIVATE_KEY, endpointSecret } = process.env;

@Injectable()
export class PaymentService {
  constructor(private stripe: Stripe) {
    this.stripe = new Stripe(STRIPE_PRIVATE_KEY);
  }

  async createSession(createPaymentDto: CreatePaymentDto) {
    const { type_of_service, unit_amount } = createPaymentDto;
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
        success_url: 'http://localhost:3000/success', // <-- payment successfull - front
        cancel_url: 'http://localhost:3000/cancel', // <-- couldnt process payment/cancellation - front
      });
      return { url: session.url, session: session };
    } catch (error) {
      return { message: error.message };
    }
  }

  async handlePayment(request) {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        request.body,
        sig,
        endpointSecret,
      );
    } catch (error) {
      return { message: error.message };
    }
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        const userEmail = event.data.object.billing_details.email;
        if (paymentIntentSucceeded.paid) {
          // Search for user and return ID
          // Create using TypeORM in a new table
        }
        break;
      default:
        return { error: "Couldn't handle payment" };
    }
  }
  catch(error) {
    return { message: error.message };
  }
}
