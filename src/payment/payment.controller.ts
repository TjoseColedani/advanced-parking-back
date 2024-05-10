import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout-session')
  createSession(@Req() req, @Res() res) {
    return this.paymentService.createSession(req, res);
  }

  @Get('success')
  success() {}

  @Get('cancel')
  cancel() {}
}
