import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { OrderDetails } from './order-details.entity';
import { payMethod } from '../../enums/core/payMethos.enum';
import { AccoutDetails } from './accountDetails.entity';
import { CardDetails } from './cardDetails.entity';
import { DispatchDetails } from './dispatchDetails.entity';

Entity();
export class PaymentMethod extends SharedEntity {
  @Column()
  profileId: string;

  @Column({
    type: 'enum',
    enum: payMethod,
    default: payMethod.TRANSFER,
  })
  method: payMethod;

  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.payMethod)
  orderDetails: OrderDetails;

  @OneToMany(() => AccoutDetails, (accountDetails) => accountDetails.payMethod)
  @JoinColumn({ name: 'accountDetailsId' })
  accountDetails: AccoutDetails;

  @OneToMany(() => CardDetails, (cardDetails) => cardDetails.payMethod)
  @JoinColumn({ name: 'accountDetailsId' })
  cardDetails: CardDetails;

  @OneToMany(
    () => DispatchDetails,
    (dispatchDetails) => dispatchDetails.payMethod,
  )
  @JoinColumn({ name: 'dispatchDetailsId' })
  dispatchDetails: DispatchDetails;
}
