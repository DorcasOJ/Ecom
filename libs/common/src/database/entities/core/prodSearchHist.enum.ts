import { subCategory } from './../../enums/core/product-sub-category.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { Product } from './product.entity';

Entity();
export class ProductSearchHistory extends SharedEntity {
  @Column()
  profileId: string;

  @Column({
    type: 'enum',
    enum: subCategory,
  })
  subCategory: subCategory;

  @Column()
  categetory: string;

  @Column()
  supplierId: string;

  @OneToMany(() => Product, (product) => product.prodSearchHist)
  product: Product[];
}
