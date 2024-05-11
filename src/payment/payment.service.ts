import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';
// import { Order } from './types/order';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({
  path: './.env.development',
});
const { STRIPE_PRIVATE_KEY } = process.env;

@Injectable()
export class PaymentService {
  constructor(private stripe: Stripe) {
    this.stripe = new Stripe(STRIPE_PRIVATE_KEY);
  }

  async createSession(req, res) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        // recibir por body
        line_items: [
          {
            price_data: {
              product_data: {
                name: 'Gold Subscription',
              },
              currency: 'usd',
              unit_amount: 20,
            },
            quantity: 1,
          },
          {
            price_data: {
              product_data: {
                name: 'Platinum Subscription',
              },
              currency: 'usd',
              unit_amount: 30,
            },
            quantity: 1,
          },
          {
            price_data: {
              product_data: {
                name: 'Normal Subscription',
              },
              currency: 'usd',
              unit_amount: 10,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success', // <-- payment successfull - front
        cancel_url: 'http://localhost:3000/cancel', // <-- couldnt process payment/cancellation - front
      });

      console.log(session);
      return res.json({ url: session.url });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
