import { Role } from 'src/roles.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from './appointment.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'bigint' })
  phone: number;

  @Column({ type: 'varchar', default: Role.User })
  role: Role;

  @Column({ type: 'varchar' })
  status: 'active' | 'deleted';

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];
}
