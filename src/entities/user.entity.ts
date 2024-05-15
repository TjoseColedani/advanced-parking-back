import { Role } from 'src/enums/roles.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from './appointment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'ID único generado automáticamente para el usuario',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  id: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Carlos Garcia',
  })
  name: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'carlosgarcia@example.com',
  })
  email: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'P@ssw0rd123',
  })
  password: string;

  @Column({ type: 'bigint' })
  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: 1234567890,
  })
  phone: number;

  @Column({ type: 'varchar', default: Role.User })
  @ApiProperty({
    description: 'Rol del usuario',
    example: Role.User,
    enum: Role,
  })
  role: Role;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Estado del usuario, puede ser "active" o "deleted"',
    example: 'active',
  })
  status: 'active' | 'deleted';

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  @ApiProperty({
    description: 'Lista de citas asociadas a este usuario',
    type: () => Appointment,
    isArray: true,
  })
  appointments: Appointment[];
}
