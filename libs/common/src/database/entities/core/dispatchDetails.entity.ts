// import { payMethod } from './../../enums/core/payMethos.enum';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { dispatch } from '../../enums/core/dispatch.enum';
import { DeliveryDetails } from './deliveryDetails.entity';
import { PaymentMethod } from './payMethod.entity';

Entity();
export class DispatchDetails extends SharedEntity {
  @Column()
  orderItemsId: string;

  @Column()
  shipmentDate: string;

  @Column({
    type: 'enum',
    enum: dispatch,
    default: dispatch.DISPATCH5,
  })
  fulfiledBy: dispatch;

  @OneToOne(() => DeliveryDetails, (delvDetails) => delvDetails.dispatchDetails)
  @JoinColumn({ name: 'delvDetailsId' })
  delvDetails: DeliveryDetails;

  @OneToOne(() => PaymentMethod, (payMethod) => payMethod.dispatchDetails)
  @JoinColumn({ name: 'payMethodId' })
  payMethod: PaymentMethod;
}