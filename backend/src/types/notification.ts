import { NotificationTypes } from "./notificationTypes";
import { NotificationMethod } from "./notificationMethod";

export interface Notification {
  notification_id: string;
  user_id: string;
  appointment_id?: string;
  type: NotificationTypes;
  method: NotificationMethod;
  content: string;
  sent_at?: Date;
}
