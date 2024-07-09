import { Column, Entity, OneToOne } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { Product } from './product.entity';
import { ratings } from '../../enums/core/dispatch.enum';

Entity();
export class CustomerFeedback extends SharedEntity {
  @Column({
    type: 'enum',
    enum: ratings,
    default: ratings.NONE,
  })
  ratings: ratings;

  @Column({ nullable: true })
  title: string;

  @Column()
  comments: string;

  @Column()
  productId: string;

  @Column()
  supplierId: string;
  @OneToOne(() => Product, (product) => product.prodSpec)
  product: Product;
}
