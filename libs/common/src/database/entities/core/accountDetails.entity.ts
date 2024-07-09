import { Column, Entity, ManyToOne } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { PaymentMethod } from './payMethod.entity';

Entity();
export class AccoutDetails extends SharedEntity {
  @Column({ nullable: true })
  profileId: string;

  @Column({ nullable: true })
  bank: string;

  @Column({ nullable: true })
  accountNumber: string;

  @ManyToOne(() => PaymentMethod, (payMethod) => payMethod.accountDetails)
  payMethod: PaymentMethod;
}
