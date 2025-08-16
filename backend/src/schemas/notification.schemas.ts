import { z } from 'zod';
import { NotificationTypes } from '../types/notification_types';
import { NotificationMethod } from '../types/notificationMethod';

// Validation for creating notification
export const CreateNotificationSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  appointment_id: z.string().optional(),
  type: z.nativeEnum(NotificationTypes, {
    errorMap: () => ({ message: 'Invalid notification type' }),
  }),
  method: z.nativeEnum(NotificationMethod, {
    errorMap: () => ({ message: 'Invalid notification method' }),
  }),
  content: z.string().min(1, 'Content is required'),
});

// Validation for notification query parameters
export const GetNotificationsQuerySchema = z.object({
  user_id: z.string().optional(),
  appointment_id: z.string().optional(),
  type: z.nativeEnum(NotificationTypes).optional(),
  method: z.nativeEnum(NotificationMethod).optional(),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().transform(val => parseInt(val)).pipe(z.number().min(0)).optional(),
  unread_only: z.string().transform(val => val === 'true').optional(),
});

// Validation for bulk notification
export const BulkNotificationSchema = z.object({
  user_ids: z.array(z.string()).min(1, 'At least one user ID is required'),
  appointment_id: z.string().optional(),
  type: z.nativeEnum(NotificationTypes),
  method: z.nativeEnum(NotificationMethod),
  content: z.string().min(1, 'Content is required'),
});

// Validation for marking notifications as read
export const MarkAsReadSchema = z.object({
  notification_ids: z.array(z.string()).min(1, 'At least one notification ID is required'),
});

export type CreateNotificationRequest = z.infer<typeof CreateNotificationSchema>;
export type GetNotificationsQuery = z.infer<typeof GetNotificationsQuerySchema>;
export type BulkNotificationRequest = z.infer<typeof BulkNotificationSchema>;
export type MarkAsReadRequest = z.infer<typeof MarkAsReadSchema>;
