import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Slot } from './slot.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ParkingLot } from './parkingLot.entity';
import { Payment } from './payment.entity';

@Entity({
  name: 'appointments',
})
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'ID único generado automáticamente para la cita',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  id: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Matrícula del vehículo para la cita',
    example: 'ABC123',
  })
  license_plate: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Fecha de la cita en formato YYYY-MM-DD',
    example: '2024-05-15',
  })
  date: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Hora de la cita en formato HH:mm',
    example: '14:00',
  })
  time: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Duración de la reserva del estacionamiento, por ejemplo "2h"',
    example: '2h',
  })
  duration: string;

  @Column({ type: 'boolean' })
  @ApiProperty({
    description: 'Indica si el coche está estacionado',
    example: true,
  })
  is_parked: boolean;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Estado de la cita, puede ser "active" o "deleted"',
    example: 'active',
  })
  status: 'active' | 'deleted';

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: 'Usuario asociado a la cita',
    type: () => User,
  })
  user: User;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({
    description: 'Número del espacio de estacionamiento',
    example: 'A12',
  })
  slot_number: string;

  @Column({ type: 'float' })
  @ApiProperty({
    description: 'Total a pagar por la cita',
    example: 20.0,
  })
  total: number;

  @ManyToOne(() => Slot, (slot) => slot.appointment)
  @JoinColumn({ name: 'slot_id' })
  @ApiProperty({
    description: 'Espacio de estacionamiento asociado a la cita',
    type: () => Slot,
  })
  slot: Slot;

  @ManyToOne(() => ParkingLot, (parkingLot) => parkingLot.appointments)
  @JoinColumn({ name: 'parking_lot_id' })
  @ApiProperty({
    description: 'Estacionamiento asociado a la cita',
    type: () => ParkingLot,
  })
  parking_lot: ParkingLot;

  @OneToOne(() => Payment, (payment) => payment.appointment)
  @ApiProperty({
    description: 'Pago asociado a la cita',
    type: () => Payment,
  })
  payment: Payment;

  @Column({ type: 'timestamp' })
  @ApiProperty({
    description: 'Fecha y hora de inicio de la cita',
    example: '2024-05-15T14:00:00Z',
  })
  start_time: Date;

  @Column({ type: 'timestamp' })
  @ApiProperty({
    description: 'Fecha y hora de finalización de la cita',
    example: '2024-05-15T16:00:00Z',
  })
  end_time: Date;
}
