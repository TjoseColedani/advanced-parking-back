import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity({
    name: 'payment',
})

export class Payment {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({
    type: 'varchar'
})
nameOfSubscription: string;

@Column({
    type: 'varchar'
})
price: string;

@Column({
    type: 'varchar'
})
currency: string;

// @ManyToOne(() => User, user => user.payment)
// @JoinColumn({ name: 'user_id' })

// user: User;


}