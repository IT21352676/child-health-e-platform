import { AppointmentStatus } from "./appointmentStatus";

export interface Appointment {
  appointmentId: string;
  userId: string; // parent user id
  childId?: string; // optional child id if available in schema
  serviceId: string;
  appointmentDatetime: string; // ISO string
  status: AppointmentStatus;
  referenceNumber: string;
  qrCodeData: string;
  createdAt?: string;
}
