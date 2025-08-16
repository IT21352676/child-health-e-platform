import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';
import {
  CreateNotificationSchema,
  GetNotificationsQuerySchema,
  BulkNotificationSchema,
  MarkAsReadSchema
} from '../schemas/notificationSchemas';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async createNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = CreateNotificationSchema.parse(req.body);
      const notification = await this.notificationService.createNotification(validatedData);

      res.status(201).json({
        status: 'success',
        message: 'Notification created and sent successfully',
        data: notification
      });
    } catch (error) {
      next(error);
    }
  }

  async createBulkNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = BulkNotificationSchema.parse(req.body);
      const notifications = await this.notificationService.createBulkNotifications(validatedData);

      res.status(201).json({
        status: 'success',
        message: `${notifications.length} notifications created and sent successfully`,
        data: notifications
      });
    } catch (error) {
      next(error);
    }
  }

  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedQuery = GetNotificationsQuerySchema.parse(req.query);
      const notifications = await this.notificationService.getNotificationsByQuery(validatedQuery);

      res.status(200).json({
        status: 'success',
        data: notifications
      });
    } catch (error) {
      next(error);
    }
  }

  async getNotificationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { notificationId } = req.params;
      const notification = await this.notificationService.getNotificationById(notificationId);

      if (!notification) {
        res.status(404).json({
          status: 'error',
          message: 'Notification not found'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: notification
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { notificationId } = req.params;
      await this.notificationService.deleteNotification(notificationId);

      res.status(200).json({
        status: 'success',
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper endpoints for common scenarios
  async sendAppointmentConfirmation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user_id, appointment_id } = req.body;

      if (!user_id || !appointment_id) {
        res.status(400).json({
          status: 'error',
          message: 'user_id and appointment_id are required'
        });
        return;
      }

      await this.notificationService.sendAppointmentConfirmation(user_id, appointment_id);

      res.status(200).json({
        status: 'success',
        message: 'Appointment confirmation sent successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async sendAppointmentReminder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user_id, appointment_id } = req.body;

      if (!user_id || !appointment_id) {
        res.status(400).json({
          status: 'error',
          message: 'user_id and appointment_id are required'
        });
        return;
      }

      await this.notificationService.sendAppointmentReminder(user_id, appointment_id);

      res.status(200).json({
        status: 'success',
        message: 'Appointment reminder sent successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async sendDocumentStatusUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user_id, document_name, status } = req.body;

      if (!user_id || !document_name || !status) {
        res.status(400).json({
          status: 'error',
          message: 'user_id, document_name, and status are required'
        });
        return;
      }

      await this.notificationService.sendDocumentStatusUpdate(user_id, document_name, status);

      res.status(200).json({
        status: 'success',
        message: 'Document status notification sent successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
