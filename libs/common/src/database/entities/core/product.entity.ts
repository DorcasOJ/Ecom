import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { subCategory } from '../../enums/core/product-sub-category.enum';
import { LikedProduct } from './likedProduct.entity';
import { ProductSpecification } from './prod-specs.entity';
import { CustomerFeedback } from './custFeedback.entity';
import { ProductSearchHistory } from './prodSearchHist.enum';
import { Category } from './category.entity';
import { OrderDetails } from './order-details.entity';

Entity();
export class Product extends SharedEntity {
  @Column()
  supplierId: string;

  @OneToOne(() => ProductSpecification, (prodSpec) => prodSpec.product)
  @JoinColumn({ name: 'prodSpecId' })
  prodSpec: ProductSpecification;

  @Column()
  customerFeedbackId: string;

  @Column()
  prodSpecId: string;

  @OneToOne(() => CustomerFeedback, (custFeedback) => custFeedback.product)
  @JoinColumn({ name: 'custFeedbackId' })
  customerFeedback: CustomerFeedback;

  @Column()
  productName: string;

  @Column()
  productImages: string;

  @Column()
  brand: string;

  @Column()
  price: number;

  @Column()
  discount: number;

  @Column()
  unitsAvailable: number;

  @Column()
  insurancePrice: number;

  @Column('text')
  productDetails: string;

  @Column('text')
  inTheBox: string;

  @Column('text')
  keyFeatures: string;

  @Column('boolean')
  sponsored: boolean;

  @Column({ nullable: true })
  sponsorshipId: string;

  @Column()
  categoryId: string;

  @Column({
    type: 'enum',
    enum: subCategory,
    default: subCategory.beverages,
  })
  subCategory: subCategory;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column()
  releaseDate: string;

  @Column()
  deliverydDate: string;

  @Column('boolean')
  returnableStatus: boolean;

  @Column({ nullable: true })
  numberOfLiked: number;

  @ManyToOne(() => LikedProduct, (likedProduct) => likedProduct.product)
  @JoinColumn({ name: 'likedProductId' })
  likedProduct: LikedProduct;

  @ManyToOne(
    () => ProductSearchHistory,
    (prodSearchHist) => prodSearchHist.product,
  )
  @JoinColumn({ name: 'prodSearchHistId' })
  prodSearchHist: ProductSearchHistory;

  @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
  orderDetails: OrderDetails[];
}
