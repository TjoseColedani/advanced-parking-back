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
        ],
        mode: 'payment',
        success_url: 'http://localhost:3001/success', // <-- payment successful - front
        cancel_url: 'http://localhost:3001/cancel', // <-- couldn't process payment/cancellation - front
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
    console.log(`🔔  Payment received!`);
  } else {
    console.log("no es succeded")
    return {event: event.data.object}
  }

  
  
  }
}
}