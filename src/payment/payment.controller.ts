import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payment')
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
