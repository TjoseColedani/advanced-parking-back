import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Slot } from './slot.entity';
import { Appointment } from './appointment.entity';

@Entity({
  name: 'parking_lot',
})
export class ParkingLot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer' })
  slots_stock: number;

  @Column({ type: 'varchar' })
  location: string;

  @OneToMany(() => Slot, (slot) => slot.parking_lot)
  slot: Slot;

  @OneToMany(() => Appointment, (appointment) => appointment.parking_lot)
  appointments: Appointment[];
}
