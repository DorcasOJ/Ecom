import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { Users } from '../identity/users.entity';
import { OrderDetails } from './order-details.entity';

@Entity()
export class Profile extends SharedEntity {
  @Column()
  email: string;

  @Column()
  userId: string;

  // @Column()
  // profile_order_id: string;

  @Column()
  address: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @OneToOne(() => Users, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  // @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.profile)
  // orderDetails: OrderDetails[];
}
