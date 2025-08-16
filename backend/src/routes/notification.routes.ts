import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { 
  CreateNotificationSchema, 
  GetNotificationsQuerySchema, 
  BulkNotificationSchema 
} from '../schemas/notification.schemas';
import { z } from 'zod';

const router = Router();
const notificationController = new NotificationController();

// Parameter validation schema
const NotificationIdSchema = z.object({
  notificationId: z.string().min(1, 'Notification ID is required')
});

// POST /api/v1/notifications - Create single notification
router.post(
  '/',
  validateBody(CreateNotificationSchema),
  notificationController.createNotification.bind(notificationController)
);

// POST /api/v1/notifications/bulk - Create bulk notifications
router.post(
  '/bulk',
  validateBody(BulkNotificationSchema),
  notificationController.createBulkNotifications.bind(notificationController)
);

// GET /api/v1/notifications - Get notifications with filters
router.get(
  '/',
  validateQuery(GetNotificationsQuerySchema),
  notificationController.getNotifications.bind(notificationController)
);

// GET /api/v1/notifications/:notificationId - Get specific notification
router.get(
  '/:notificationId',
  validateParams(NotificationIdSchema),
  notificationController.getNotificationById.bind(notificationController)
);

// DELETE /api/v1/notifications/:notificationId - Delete notification
router.delete(
  '/:notificationId',
  validateParams(NotificationIdSchema),
  notificationController.deleteNotification.bind(notificationController)
);

// Helper endpoints for common scenarios
// POST /api/v1/notifications/appointment/confirmation - Send appointment confirmation
router.post(
  '/appointment/confirmation',
  notificationController.sendAppointmentConfirmation.bind(notificationController)
);

// POST /api/v1/notifications/appointment/reminder - Send appointment reminder
router.post(
  '/appointment/reminder',
  notificationController.sendAppointmentReminder.bind(notificationController)
);

// POST /api/v1/notifications/document/status - Send document status update
router.post(
  '/document/status',
  notificationController.sendDocumentStatusUpdate.bind(notificationController)
);

export default router;
