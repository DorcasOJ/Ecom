import { Column, Entity } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import {
  sponsorshipLength,
  sponsorshipType,
} from '../../enums/core/sponsorship.enum';

Entity();
export class ProductSponsorShip extends SharedEntity {
  @Column()
  productId: string;

  @Column({
    type: 'enum',
    enum: sponsorshipType,
    default: sponsorshipType.Basic,
  })
  sponsorshipType: sponsorshipType;

  @Column({
    type: 'enum',
    enum: sponsorshipLength,
    default: sponsorshipLength.sixMonths,
  })
  sponsorshipLength: sponsorshipLength;
}
