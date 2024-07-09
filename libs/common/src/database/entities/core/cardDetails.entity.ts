import { Column, Entity, ManyToOne } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { PaymentMethod } from './payMethod.entity';

Entity();
export class CardDetails extends SharedEntity {
  @Column({ nullable: true })
  profileId: string;

  @Column({ nullable: true })
  bank: string;

  @Column({ nullable: true })
  cardNumber: string;

  @Column({ nullable: true })
  cvv: string;

  @Column({ nullable: true })
  expiredDate: string;

  @ManyToOne(() => PaymentMethod, (payMethod) => payMethod.cardDetails)
  payMethod: PaymentMethod;
}

// bank and number should be hashed
