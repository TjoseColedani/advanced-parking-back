import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
