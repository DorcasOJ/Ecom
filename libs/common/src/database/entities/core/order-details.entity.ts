import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { ApiProperty } from '@nestjs/swagger';
import { Cart } from './cart.entity';
import { PaymentMethod } from './payMethod.entity';
import { DeliveryDetails } from './deliveryDetails.entity';
import { CustomerAddress } from './custAddress.entity';
import { Profile } from './profile.entity';
import { Product } from './product.entity';

Entity();
export class OrderDetails extends SharedEntity {
  @Column()
  @ApiProperty()
  orderNumber: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateplaced: Date;

  @ApiProperty()
  @Column()
  voucherCode: string;

  @ApiProperty()
  @Column()
  subTotal: number;

  @OneToMany(() => Cart, (cart) => cart.orderDetails)
  @JoinColumn({ name: 'cartId' })
  cart: Cart[];

  @OneToOne(() => PaymentMethod, (payMenthod) => payMenthod.orderDetails)
  @JoinColumn({ name: 'payMethodId' })
  payMethod: PaymentMethod;

  @OneToOne(() => DeliveryDetails, (delvDetails) => delvDetails.orderDetails)
  @JoinColumn({ name: 'delvDetailsId' })
  delvDetails: DeliveryDetails;

  @OneToOne(() => CustomerAddress, (custAddress) => custAddress.orderDetails)
  @JoinColumn({ name: 'custAddressId' })
  custAddress: CustomerAddress;

  // @ManyToOne(() => Profile, (profile) => profile.orderDetails)
  // @JoinColumn({ name: 'profile_order_id' })
  // profile: Profile;

  @ManyToMany(() => Product, (product) => product.orderDetails)
  @JoinTable({ name: 'order_product' })
  products: Product[];
}
