import { Role } from 'src/enums/roles.enum';
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

  @Column({ type: 'bigint', default: 12345678 })
  phone: number;

  @Column({ type: 'varchar', default: Role.User })
  role: Role;

  @Column({ type: 'varchar', default: 'active' })
  status: 'active' | 'deleted';

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];
}
