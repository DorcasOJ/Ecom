// import { MaxLength, MinLength } from 'class-validator';
import { BeforeInsert, OneToMany, Entity, Column, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
// import { randomBytes, pbkdf2Sync } from 'crypto';
import { SharedEntity } from '../sharedEntity';
import { UserRole } from '../../enums/identity/userRole.enum';
import { LoginHistory } from './loginHistory.entity';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { Profile } from '../core/profile.entity';

@Entity()
export class Users extends SharedEntity {
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isGoogleAuthUser: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  profileID?: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
  })
  user_role: UserRole;

  @Column('text', { nullable: true })
  @Exclude()
  refreshToken?: string;

  @OneToMany(() => LoginHistory, (loginHistory) => loginHistory.history, {
    onDelete: 'CASCADE',
  })
  loginHistories: LoginHistory[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile

  @Column({ unique: true, nullable: true })
  @Exclude()
  userOTP?: string;

  @BeforeInsert()
  public setPassword() {
    if (this.password) {
      const salt = randomBytes(32).toString('hex');
      console.log('salt', salt);
      const hash = pbkdf2Sync(this.password, salt, 1000, 64, 'sha512').toString(
        'hex',
      );
      const hashedPassword = `${salt}:${hash}`;
      this.password = hashedPassword;
      return this.password;
    } else {
      return this.password;
    }
  }
}
