import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'slots',
})
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  slot_number: number;

  @Column({ type: 'boolean' })
  is_free: boolean;
}
