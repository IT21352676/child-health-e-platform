import { NotificationTypes } from "./notification_types";
import { NotificationMethod } from "./notificationMethod";

export interface Notification {
  notification_id: string;
  user_id: string;
  appointment_id: string;
  type: NotificationTypes;
  methos: NotificationMethod;
  content: string;
}
