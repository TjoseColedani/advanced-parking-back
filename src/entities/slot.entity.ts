import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { ParkingLot } from './parkingLot.entity';
import { SlotStatus } from 'src/enums/slot-status.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'slots',
})
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description:
      'ID único generado automáticamente para el espacio de estacionamiento',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  id: string;

  @Column({ default: SlotStatus.Available })
  @ApiProperty({
    description: 'Estado del espacio de estacionamiento',
    example: SlotStatus.Available,
    enum: SlotStatus,
  })
  slot_status: SlotStatus;

  @Column({ type: 'int' })
  @ApiProperty({
    description: 'Número del espacio de estacionamiento',
    example: 1,
  })
  slot_number: number;

  @OneToMany(() => Appointment, (appointment) => appointment.slot)
  @ApiProperty({
    description:
      'Cita asociada a este espacio de estacionamiento, puede ser nulo',
    type: () => Appointment,
    nullable: true,
  })
  appointment: Appointment | null;

  @ManyToOne(() => ParkingLot, (parking_lot) => parking_lot.slot)
  @JoinColumn({ name: 'parking_lot_id' })
  @ApiProperty({
    description:
      'Estacionamiento al que pertenece este espacio de estacionamiento',
    type: () => ParkingLot,
  })
  parking_lot: ParkingLot;
}
