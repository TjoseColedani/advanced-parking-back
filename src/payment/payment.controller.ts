import { Body, Controller, RawBodyRequest, Post, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from 'src/dtos/payment.dto';
import { Request } from 'express';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout-session')
  async createSession(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.createSession(createPaymentDto);
  }

  @Post('webhook')
  async handleWebhook(@Req() requestToTransform: RawBodyRequest<Request>, @Req() requestNormal: Request) {
    const rawBody = requestToTransform.rawBody;
    return await this.paymentService.handlePayment(rawBody, requestNormal);
  }
}