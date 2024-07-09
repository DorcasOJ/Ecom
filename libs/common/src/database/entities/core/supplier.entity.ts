import { Column, Entity } from 'typeorm';
import { SharedEntity } from '../sharedEntity';

Entity();
export class Supplier extends SharedEntity {
  @Column()
  StoreName: string;

  @Column()
  storeAddress: string;

  @Column()
  mobileAddress: string;

  @Column()
  country: string;

  @Column()
  email: string;

  // fill the restsss
}
