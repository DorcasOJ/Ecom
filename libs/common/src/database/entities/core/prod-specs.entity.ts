import { Column, Entity, OneToOne } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

Entity();
export class ProductSpecification extends SharedEntity {
  @Column()
  @ApiProperty({ description: 'SKU' })
  SKU: string;

  @ApiProperty({ description: 'category' })
  @Column()
  productLine: string;

  @ApiProperty({ description: 'product model' })
  @Column()
  Model: string;

  @ApiProperty({ description: 'MADE IN' })
  @Column()
  productionCountry: string;

  @Column()
  @ApiProperty({ description: 'L x W x H cm' })
  size: string;

  @Column()
  @ApiProperty()
  Weight: string

  @ApiProperty()
  @Column()
  color: string;

  @ApiProperty()
  @Column()
  mainMaterial: string

  @OneToOne(() => Product, (product) => product.prodSpec)
  product: Product;
}
