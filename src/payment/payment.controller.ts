import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from 'src/dtos/payment.dto';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout-session')
  async createSession(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.createSession(createPaymentDto);
  }

  @Post()
  async handleWebhook(@Req() request: Request) {
    return await this.paymentService.handlePayment(request)
  }
}
