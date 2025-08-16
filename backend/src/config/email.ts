import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export const emailConfig: EmailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
};

export const createTransporter = () => {
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    throw new Error('Email configuration is missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
  }

  return nodemailer.createTransport(emailConfig);
};

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const emailTemplates = {
  appointmentConfirmed: (appointmentDetails: any): EmailTemplate => ({
    subject: 'Appointment Confirmed - Child Health Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Appointment Confirmed</h2>
        <p>Dear User,</p>
        <p>Your appointment has been confirmed with the following details:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          <p><strong>Appointment ID:</strong> ${appointmentDetails.appointment_id}</p>
          <p><strong>Service:</strong> ${appointmentDetails.service_name}</p>
          <p><strong>Date:</strong> ${appointmentDetails.appointment_date}</p>
          <p><strong>Time:</strong> ${appointmentDetails.appointment_time}</p>
        </div>
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <p>Best regards,<br>Child Health Platform Team</p>
      </div>
    `,
    text: `Appointment Confirmed\n\nYour appointment has been confirmed:\nID: ${appointmentDetails.appointment_id}\nService: ${appointmentDetails.service_name}\nDate: ${appointmentDetails.appointment_date}\nTime: ${appointmentDetails.appointment_time}\n\nPlease arrive 15 minutes early.`
  }),

  appointmentReminder: (appointmentDetails: any): EmailTemplate => ({
    subject: 'Appointment Reminder - Child Health Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF9800;">Appointment Reminder</h2>
        <p>Dear User,</p>
        <p>This is a reminder for your upcoming appointment:</p>
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #FF9800;">
          <p><strong>Appointment ID:</strong> ${appointmentDetails.appointment_id}</p>
          <p><strong>Service:</strong> ${appointmentDetails.service_name}</p>
          <p><strong>Date:</strong> ${appointmentDetails.appointment_date}</p>
          <p><strong>Time:</strong> ${appointmentDetails.appointment_time}</p>
        </div>
        <p>Please don't forget to bring any required documents.</p>
        <p>Best regards,<br>Child Health Platform Team</p>
      </div>
    `,
    text: `Appointment Reminder\n\nUpcoming appointment:\nID: ${appointmentDetails.appointment_id}\nService: ${appointmentDetails.service_name}\nDate: ${appointmentDetails.appointment_date}\nTime: ${appointmentDetails.appointment_time}\n\nPlease bring required documents.`
  }),

  documentStatusUpdate: (documentDetails: any): EmailTemplate => ({
    subject: `Document ${documentDetails.status} - Child Health Platform`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${documentDetails.status === 'accept' ? '#4CAF50' : '#f44336'};">Document ${documentDetails.status === 'accept' ? 'Approved' : 'Rejected'}</h2>
        <p>Dear User,</p>
        <p>Your document has been ${documentDetails.status === 'accept' ? 'approved' : 'rejected'}:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          <p><strong>Document:</strong> ${documentDetails.file_name}</p>
          <p><strong>Type:</strong> ${documentDetails.document_type}</p>
          <p><strong>Status:</strong> ${documentDetails.status === 'accept' ? 'Approved' : 'Rejected'}</p>
        </div>
        ${documentDetails.status === 'reject' ? '<p>Please contact us for more information or resubmit the document.</p>' : '<p>Your document has been successfully processed.</p>'}
        <p>Best regards,<br>Child Health Platform Team</p>
      </div>
    `,
    text: `Document ${documentDetails.status === 'accept' ? 'Approved' : 'Rejected'}\n\nDocument: ${documentDetails.file_name}\nType: ${documentDetails.document_type}\nStatus: ${documentDetails.status === 'accept' ? 'Approved' : 'Rejected'}`
  })
};
