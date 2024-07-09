import { Column, Entity, OneToMany } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { Product } from './product.entity';

Entity();
export class LikedProduct extends SharedEntity {
  @Column()
  profileId: string;

  @OneToMany(() => Product, (product) => product.likedProduct)
  product: Product[];
}
