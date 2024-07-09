import { Column, Entity } from 'typeorm';
import { SharedEntity } from '../sharedEntity';

@Entity()
export class Profile extends SharedEntity {
  @Column()
  email: string;

  @Column()
  userId: string;

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
}
