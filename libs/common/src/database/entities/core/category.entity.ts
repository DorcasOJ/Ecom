import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { Product } from './product.entity';

Entity();
export class Category extends SharedEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  @JoinColumn()
  products: Product[];
}
