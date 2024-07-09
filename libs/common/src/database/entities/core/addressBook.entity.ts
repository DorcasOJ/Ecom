import { Column, Entity, ManyToOne } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { CustomerAddress } from './custAddress.entity';

Entity();
export class AddressBook extends SharedEntity {
  @Column()
  profileId: string;

  @Column()
  prefix1: string;

  @Column()
  prefix2: string;

  @Column()
  mobileNumber1: string;

  @Column()
  mobileNumber2: string;

  @Column()
  deliveryAddress: string;

  @Column()
  additionalInformation: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column('boolean')
  select: boolean;

  @ManyToOne(() => CustomerAddress, (custAddress) => custAddress.addressBook)
  custAddress: CustomerAddress;
}
