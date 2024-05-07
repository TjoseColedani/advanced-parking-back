import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Slot } from './slot.entity';

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
}
