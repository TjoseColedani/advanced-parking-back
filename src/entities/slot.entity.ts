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

@Entity({
  name: 'slots',
})
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  slot_stock: number;

  @Column({ default: SlotStatus.Available })
  slot_status: SlotStatus;

  @OneToMany(() => Appointment, (appointment) => appointment.slot)
  appointment: Appointment;

  @ManyToOne(() => ParkingLot, (parking_lot) => parking_lot.slot)
  @JoinColumn({ name: 'parking_lot_id' })
  parking_lot: ParkingLot;
}
