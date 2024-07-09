import { Column, Entity } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { ContactEnum } from '../../enums/core/contact.enum';

@Entity()
export class ContactUs extends SharedEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  org_name: string;

  @Column()
  email: string;

  @Column({ nullable: true, default: false })
  mobile: boolean;

  @Column()
  message: string;

  @Column({
    type: 'enum',
    enum: ContactEnum,
    default: ContactEnum.Other,
  })
  goal: ContactEnum;
}
