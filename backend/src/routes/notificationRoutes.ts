import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import {
  CreateNotificationSchema,
  GetNotificationsQuerySchema,
  BulkNotificationSchema
} from '../schemas/notificationSchemas';
import { z } from 'zod';

const router = Router();
const notificationController = new NotificationController();

// Parameter validation schema
const NotificationIdSchema = z.object({
  notificationId: z.string().min(1, 'Notification ID is required')
});

//  Create single notification
router.post(
  '/',
  validateBody(CreateNotificationSchema),
  notificationController.createNotification.bind(notificationController)
);

//  Create bulk notifications
router.post(
  '/bulk',
  validateBody(BulkNotificationSchema),
  notificationController.createBulkNotifications.bind(notificationController)
);

// Get notifications with filters
router.get(
  '/',
  validateQuery(GetNotificationsQuerySchema),
  notificationController.getNotifications.bind(notificationController)
);

//  Get specific notification
router.get(
  '/:notificationId',
  validateParams(NotificationIdSchema),
  notificationController.getNotificationById.bind(notificationController)
);

//  Delete notification
router.delete(
  '/:notificationId',
  validateParams(NotificationIdSchema),
  notificationController.deleteNotification.bind(notificationController)
);

// Helper endpoints for common scenarios
//  Send appointment confirmation
router.post(
  '/appointment/confirmation',
  notificationController.sendAppointmentConfirmation.bind(notificationController)
);

// - Send appointment reminder
router.post(
  '/appointment/reminder',
  notificationController.sendAppointmentReminder.bind(notificationController)
);

//  Send document status update
router.post(
  '/document/status',
  notificationController.sendDocumentStatusUpdate.bind(notificationController)
);

export default router;
