import { IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  type_of_service: string;
  @IsString()
  unit_amount: number;
  @IsString()
  appointment_id: string;
}
