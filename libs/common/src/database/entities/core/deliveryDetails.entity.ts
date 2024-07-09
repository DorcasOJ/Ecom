import { Column, Entity, OneToOne } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { OrderDetails } from './order-details.entity';
import { DispatchDetails } from './dispatchDetails.entity';
import { deliveryMethod } from '../../enums/core/payMethos.enum';

Entity();
export class DeliveryDetails extends SharedEntity {
  @Column()
  orderDetailsId: string;

  @Column({
    type: 'enum',
    enum: deliveryMethod,
  })
  DelMethod: deliveryMethod;

  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.payMethod)
  orderDetails: OrderDetails;

  @OneToOne(
    () => DispatchDetails,
    (dispatchDetails) => dispatchDetails.delvDetails,
  )
  dispatchDetails: DispatchDetails;
}
