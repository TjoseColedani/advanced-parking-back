import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({
  name: 'reviews',
})
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  message: string;
  @Column({ type: 'int', default: 1 })
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
}
