import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateParkingLotDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  location: string;
  @IsNumber()
  @IsNotEmpty()
  slot_stock: number;
  @IsNumber()
  @IsNotEmpty()
  lat: number;
  @IsNumber()
  @IsNotEmpty()
  lng: number;
}

export class UpdateParkingLotDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  location: string;
  @IsNumber()
  @IsOptional()
  slot_stock: number;
  @IsNumber()
  @IsOptional()
  lat: number;
  @IsNumber()
  @IsOptional()
  lng: number;
}
