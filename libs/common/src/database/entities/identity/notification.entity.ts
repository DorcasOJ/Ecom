import { NotificationStatus } from './../../enums/identity/notification.status.enum';
import { Column, Entity } from 'typeorm';
import { SharedEntity } from '../sharedEntity';

@Entity()
export class Notification extends SharedEntity {
  @Column({ nullable: true })
  notification_title: string;

  @Column({ nullable: false })
  notification_detail: string;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  notification_status: NotificationStatus;

  @Column({ nullable: false })
  developer_id: string;
}
