import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Appointment } from './appointment.entity';

@Entity({
  name: 'payment',
})
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  type_of_service: string;

  @Column({default: 0})
  amount_paid: number;

  @ManyToOne(() => User, user => user.payment)
  user: User;

  @OneToOne(() => Appointment, appointment => appointment.payment)
  appointment: Appointment;
}
