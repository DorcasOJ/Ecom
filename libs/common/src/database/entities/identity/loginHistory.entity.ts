import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SharedEntity } from '../sharedEntity';
import { Users } from './users.entity';
import { getBrowser, getLocation, getOS } from '@app/common/helpers/user-info';

@Entity()
export class LoginHistory extends SharedEntity {
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  login_time?: string;

  @Column('simple-json', { nullable: true })
  country?: { longitude: string; latitude: string };

  @Column({ nullable: true })
  ip_address?: string;

  @Column({ nullable: true })
  browser_name?: string;

  @Column({ nullable: true })
  os_name?: string;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => Users, (users) => users.loginHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  history: LoginHistory;

  @BeforeInsert()
  public setPassword() {
    if (this.country) {
      const count = getLocation();
      console.log('country', count);
      this.country = count;
      // return this.country
    } else {
      return this.country;
    }
    if (this.browser_name) {
      const browser = getBrowser();
      console.log(browser);
      this.browser_name = browser;
      // return this.browser_name;
    } else {
      return this.browser_name;
    }
    if (this.os_name) {
      const os = getOS();
      console.log(os);
      this.os_name = os;
      // return this.os_name;
    } else {
      return this.os_name;
    }
  }
}
