import { SlotStatus } from 'src/enums/slot-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateAppointmentDto {
  /**
   * La matrícula del vehículo
   * @example 'ABC123'
   */
  @ApiProperty({
    description: 'La matrícula del vehículo',
    example: 'ABC123',
  })
  @IsNotEmpty()
  @IsString()
  license_plate: string;

  /**
   * Fecha de la cita
   * @example '2024-05-15'
   */
  @ApiProperty({
    description: 'Fecha de la cita en formato YYYY-MM-DD',
    example: '2024-05-15',
  })
  @IsNotEmpty()
  @IsString()
  date: string;

  /**
   * Hora de la cita
   * @example '14:00'
   */
  @ApiProperty({
    description: 'Hora de la cita en formato HH:mm',
    example: '14:00',
  })
  @IsNotEmpty()
  @IsString()
  time: string;

  /**
   * Duración de la reserva del estacionamiento
   * @example '2h'
   */
  @ApiProperty({
    description: 'Duración de la reserva del estacionamiento, por ejemplo "2h"',
    example: '2h',
  })
  @IsNotEmpty()
  @IsString()
  duration: string;

  /**
   * Indica si el coche está estacionado
   * @example true
   */
  @ApiProperty({
    description: 'Indica si el coche está estacionado',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  is_parked: boolean;

  /**
   * ID del usuario asociado a la cita
   * @example 'user123'
   */
  @ApiProperty({
    description: 'ID del usuario asociado a la cita',
    example: 'user123',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  /**
   * ID del estacionamiento donde se hace la reserva
   * @example 'parkingLot45'
   */
  @ApiProperty({
    description: 'ID del estacionamiento donde se hace la reserva',
    example: 'parkingLot45',
  })
  @IsNotEmpty()
  @IsString()
  parkingLotId: string;
}

export class UpdateAppointmentDto {
  /**
   * La matrícula del vehículo (opcional)
   * @example 'ABC123'
   */
  @ApiPropertyOptional({
    description: 'La matrícula del vehículo (opcional)',
    example: 'ABC123',
  })
  @IsOptional()
  @IsString()
  license_plate?: string;

  /**
   * Fecha de la cita (opcional)
   * @example '2024-05-15'
   */
  @ApiPropertyOptional({
    description: 'Fecha de la cita en formato YYYY-MM-DD (opcional)',
    example: '2024-05-15',
  })
  @IsOptional()
  @IsString()
  date?: string;

  /**
   * Hora de la cita (opcional)
   * @example '14:00'
   */
  @ApiPropertyOptional({
    description: 'Hora de la cita en formato HH:mm (opcional)',
    example: '14:00',
  })
  @IsOptional()
  @IsString()
  time?: string;

  /**
   * Duración de la reserva del estacionamiento (opcional)
   * @example '2h'
   */
  @ApiPropertyOptional({
    description:
      'Duración de la reserva del estacionamiento, por ejemplo "2h" (opcional)',
    example: '2h',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  /**
   * Indica si el coche está estacionado (opcional)
   * @example true
   */
  @ApiPropertyOptional({
    description: 'Indica si el coche está estacionado (opcional)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_parked?: boolean;

  /**
   * ID del usuario asociado a la cita (opcional)
   * @example 'user123'
   */
  @ApiPropertyOptional({
    description: 'ID del usuario asociado a la cita (opcional)',
    example: 'user123',
  })
  @IsOptional()
  @IsString()
  user_id?: string;

  /**
   * ID del estacionamiento donde se hace la reserva (opcional)
   * @example 'parkingLot45'
   */
  @ApiPropertyOptional({
    description: 'ID del estacionamiento donde se hace la reserva (opcional)',
    example: 'parkingLot45',
  })
  @IsOptional()
  @IsString()
  parkingLotId?: string;

  /**
   * Estado del espacio de estacionamiento (opcional)
   * @example 'FREE'
   */
  @ApiPropertyOptional({
    description: 'Estado del espacio de estacionamiento (opcional)',
    example: 'FREE',
  })
  @IsOptional()
  @IsEnum(SlotStatus)
  slot_status?: SlotStatus;
}
