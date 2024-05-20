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
  slot_number: string;

  @Column({ type: 'int' })
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
  parking_lot: ParkingLot;

  @OneToOne(() => Payment, (payment) => payment.appointment)
  payment: Payment;
}
