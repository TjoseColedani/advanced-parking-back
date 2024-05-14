import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { User } from './user.entity';

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

  // @ManyToOne(() => User, user => user.payment)
  // @JoinColumn({ name: 'user_id' })

  // user: User;
}
