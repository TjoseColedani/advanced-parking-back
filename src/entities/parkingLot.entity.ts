import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Slot } from './slot.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'parking_lot',
})
export class ParkingLot {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'ID único generado automáticamente para el estacionamiento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Nombre del estacionamiento',
    example: 'Parking Central',
  })
  name: string;

  @Column({ type: 'integer' })
  @ApiProperty({
    description: 'Número total de espacios en el estacionamiento',
    example: 100,
  })
  slots_stock: number;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Ubicación del estacionamiento',
    example: '123 Calle Principal, Ciudad, País',
  })
  location: string;

  @OneToMany(() => Slot, (slot) => slot.parking_lot)
  @ApiProperty({
    description:
      'Lista de espacios de estacionamiento asociados a este estacionamiento',
    type: () => Slot,
    isArray: true,
  })
  slot: Slot;
}
