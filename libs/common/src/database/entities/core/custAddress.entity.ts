import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { OrderDetails } from './order-details.entity';
import { AddressBook } from './addressBook.entity';

Entity();
export class CustomerAddress extends SharedEntity {
  @OneToMany(() => AddressBook, (addressBook) => addressBook.custAddress)
  @JoinColumn({ name: 'addressBookId' })
  addressBook: AddressBook;

  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.payMethod)
  orderDetails: OrderDetails;
}
