import { Column, Entity } from 'typeorm';
import { SharedEntity } from './sharedEntity';

@Entity()
export class OneTimePassword extends SharedEntity {
  @Column({ unique: true, nullable: true })
  otp?: string;

  @Column({ unique: true, nullable: true })
  signupToken?: string;
}
