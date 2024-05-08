import { Controller, Get, Post, Redirect, Req, Res } from '@nestjs/common';

@Controller('payment')
export class PaymentController {
    
  @Post('create-checkout-session')
  createSession(@Req() req, @Res() res) {
    // Lógica para crear la sesión de pago
  }

  @Get('success')
  success() {}

  @Get('cancel')
  cancel() {}
  
}
