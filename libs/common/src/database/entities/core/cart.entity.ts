import { Column, Entity, ManyToOne } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { ApiProperty } from '@nestjs/swagger';
import { OrderDetails } from './order-details.entity';

Entity();
export class Cart extends SharedEntity {
  @Column()
  @ApiProperty()
  productId: string;

  @ApiProperty()
  @Column()
  profileId: string;

  @ApiProperty()
  @Column()
  quantity: number;

  @ApiProperty()
  @Column()
  price: number;

  @ManyToOne(() => OrderDetails, (orderDetails) => orderDetails.cart)
  orderDetails: OrderDetails;
}
