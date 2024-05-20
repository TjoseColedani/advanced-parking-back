import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  type_of_service: string;
  @IsNumber()
  unit_amount: number;
  @IsString()
  appointment_id: string;
}
