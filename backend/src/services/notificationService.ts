import { supabase } from '../config/supabase';
import { createTransporter, emailTemplates } from '../config/email';
import { getSocketManager } from '../config/socket';
import { Notification } from '../types/notification';
import { NotificationTypes } from '../types/notificationTypes';
import { NotificationMethod } from '../types/notificationMethod';
import {
  CreateNotificationRequest,
  GetNotificationsQuery,
  BulkNotificationRequest,
  MarkAsReadRequest
} from '../schemas/notificationSchemas';

export class NotificationService {

  async createNotification(notificationData: CreateNotificationRequest): Promise<Notification> {
    try {
      // Save to database
      const { data, error } = await supabase
        .from('notification')
        .insert({
          user_id: parseInt(notificationData.user_id),
          appointment_id: notificationData.appointment_id ? parseInt(notificationData.appointment_id) : null,
          type: notificationData.type,
          method: notificationData.method,
          content: notificationData.content
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create notification: ${error.message}`);
      }

      const notification = this.mapDatabaseToNotification(data);

      // Send notification based on method
      await this.sendNotification(notification);

      return notification;
    } catch (error) {
      throw error;
    }
  }

  async createBulkNotifications(bulkData: BulkNotificationRequest): Promise<Notification[]> {
    try {
      const notifications = bulkData.user_ids.map(userId => ({
        user_id: parseInt(userId),
        appointment_id: bulkData.appointment_id ? parseInt(bulkData.appointment_id) : null,
        type: bulkData.type,
        method: bulkData.method,
        content: bulkData.content
      }));

      const { data, error } = await supabase
        .from('notification')
        .insert(notifications)
        .select();

      if (error) {
        throw new Error(`Failed to create bulk notifications: ${error.message}`);
      }

      const createdNotifications = data.map(this.mapDatabaseToNotification);

      // Send all notifications
      await Promise.all(
        createdNotifications.map(notification => this.sendNotification(notification))
      );

      return createdNotifications;
    } catch (error) {
      throw error;
    }
  }

  async getNotificationsByQuery(query: GetNotificationsQuery): Promise<Notification[]> {
    try {
      let supabaseQuery = supabase
        .from('notification')
        .select('*')
        .order('sent_at', { ascending: false });

      if (query.user_id) {
        supabaseQuery = supabaseQuery.eq('user_id', parseInt(query.user_id));
      }

      if (query.appointment_id) {
        supabaseQuery = supabaseQuery.eq('appointment_id', parseInt(query.appointment_id));
      }

      if (query.type) {
        supabaseQuery = supabaseQuery.eq('type', query.type);
      }

      if (query.method) {
        supabaseQuery = supabaseQuery.eq('method', query.method);
      }

      if (query.limit) {
        supabaseQuery = supabaseQuery.limit(query.limit);
      }

      if (query.offset) {
        supabaseQuery = supabaseQuery.range(query.offset, query.offset + (query.limit || 10) - 1);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }

      return data.map(this.mapDatabaseToNotification);
    } catch (error) {
      throw error;
    }
  }

  async getNotificationById(notificationId: string): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notification')
        .select('*')
        .eq('notification_id', parseInt(notificationId))
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to fetch notification: ${error.message}`);
      }

      return this.mapDatabaseToNotification(data);
    } catch (error) {
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notification')
        .delete()
        .eq('notification_id', parseInt(notificationId));

      if (error) {
        throw new Error(`Failed to delete notification: ${error.message}`);
      }
    } catch (error) {
      throw error;
    }
  }

  private async sendNotification(notification: Notification): Promise<void> {
    try {
      // Send real-time notification via Socket.IO
      await this.sendRealTimeNotification(notification);

      // Send email if method includes email
      if (notification.method === NotificationMethod.EMAIL) {
        await this.sendEmailNotification(notification);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      // Don't throw error here to prevent notification creation failure
    }
  }

  private async sendRealTimeNotification(notification: Notification): Promise<void> {
    try {
      const socketManager = getSocketManager();

      const notificationData = {
        id: notification.notification_id,
        type: notification.type,
        content: notification.content,
        appointment_id: notification.appointment_id,
        sent_at: notification.sent_at
      };

      // Send to specific user
      socketManager.sendToUser(notification.user_id, 'new_notification', notificationData);

      // If appointment-related, also send to appointment room
      if (notification.appointment_id) {
        socketManager.sendToAppointment(
          notification.appointment_id,
          'appointment_notification',
          notificationData
        );
      }
    } catch (error) {
      console.error('Error sending real-time notification:', error);
    }
  }

  private async sendEmailNotification(notification: Notification): Promise<void> {
    try {
      // Get user email
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('email, first_name, last_name')
        .eq('user_id', parseInt(notification.user_id))
        .single();

      if (userError || !userData) {
        throw new Error('User not found for email notification');
      }

      const transporter = createTransporter();

      let emailTemplate;
      let appointmentDetails = null;

      // Get appointment details if needed
      if (notification.appointment_id) {
        const { data: appointmentData } = await supabase
          .from('appointment')
          .select(`
            appointment_id,
            appointment_date,
            appointment_time,
            service:service_id (name)
          `)
          .eq('appointment_id', parseInt(notification.appointment_id))
          .single();

        appointmentDetails = appointmentData;
      }

      // Choose email template based on notification type
      switch (notification.type) {
        case NotificationTypes.SUCCESS:
          if (appointmentDetails) {
            emailTemplate = emailTemplates.appointmentConfirmed({
              appointment_id: appointmentDetails.appointment_id,
              service_name: appointmentDetails.service?.name || 'Health Service',
              appointment_date: appointmentDetails.appointment_date,
              appointment_time: appointmentDetails.appointment_time
            });
          }
          break;
        case NotificationTypes.ALERT:
          if (appointmentDetails) {
            emailTemplate = emailTemplates.appointmentReminder({
              appointment_id: appointmentDetails.appointment_id,
              service_name: appointmentDetails.service?.name || 'Health Service',
              appointment_date: appointmentDetails.appointment_date,
              appointment_time: appointmentDetails.appointment_time
            });
          }
          break;
        default:
          // Generic email template
          emailTemplate = {
            subject: 'Notification - Child Health Platform',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Child Health Platform</h2>
                <p>Dear ${userData.first_name} ${userData.last_name},</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                  <p>${notification.content}</p>
                </div>
                <p>Best regards,<br>Child Health Platform Team</p>
              </div>
            `,
            text: `Child Health Platform\n\nDear ${userData.first_name} ${userData.last_name},\n\n${notification.content}\n\nBest regards,\nChild Health Platform Team`
          };
      }

      if (emailTemplate) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: userData.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text
        });

        console.log(`Email sent to ${userData.email} for notification ${notification.notification_id}`);
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  // Helper methods for common notification scenarios
  async sendAppointmentConfirmation(userId: string, appointmentId: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      appointment_id: appointmentId,
      type: NotificationTypes.SUCCESS,
      method: NotificationMethod.EMAIL,
      content: 'Your appointment has been confirmed. You will receive further details via email.'
    });
  }

  async sendAppointmentReminder(userId: string, appointmentId: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      appointment_id: appointmentId,
      type: NotificationTypes.ALERT,
      method: NotificationMethod.EMAIL,
      content: 'Reminder: You have an upcoming appointment. Please check your email for details.'
    });
  }

  async sendDocumentStatusUpdate(userId: string, documentName: string, status: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: NotificationTypes.SUCCESS,
      method: NotificationMethod.EMAIL,
      content: `Your document "${documentName}" has been ${status === 'accept' ? 'approved' : 'rejected'}.`
    });
  }

  private mapDatabaseToNotification(dbRecord: any): Notification {
    return {
      notification_id: dbRecord.notification_id.toString(),
      user_id: dbRecord.user_id.toString(),
      appointment_id: dbRecord.appointment_id ? dbRecord.appointment_id.toString() : '',
      type: dbRecord.type as NotificationTypes,
      method: dbRecord.method as NotificationMethod,
      content: dbRecord.content,
      sent_at: dbRecord.sent_at ? new Date(dbRecord.sent_at) : undefined
    };
  }
}
