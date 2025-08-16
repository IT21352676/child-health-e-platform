import { AppointmentStatus } from "../types/appointmentStatus";
import {
  getAppointmentById,
  getAppointmentsByChild,
  insertAppointment,
  updateAppointmentQrCode,
} from "../models/appointment";
import { generateQrCodeData, generateReferenceNumber } from "../utils/ref";

export interface BookAppointmentInput {
  childId: string;
  serviceId: string;
  healthCenterId: string;
  appointmentDatetime: string; // ISO string
}

export const bookAppointment = async (
  userId: string,
  input: BookAppointmentInput
) => {
  // Create reference and placeholder QR first
  const reference = generateReferenceNumber();

  const inserted = await insertAppointment({
    userId,
    childId: input.childId,
    serviceId: input.serviceId,
    healthCenterId: input.healthCenterId,
    appointmentDatetime: input.appointmentDatetime,
    status: AppointmentStatus.PENDING,
    referenceNumber: reference,
    qrCodeData: "", // set after we know appointment_id
  });

  const appointmentId: string = inserted.appointment_id;
  const qr = generateQrCodeData(appointmentId);
  const updated = await updateAppointmentQrCode(appointmentId, qr);

  return {
    appointmentId,
    appointmentDatetime: updated.appointment_datetime as string,
    status: updated.status as string,
    referenceNumber: updated.reference_number as string,
    qrCodeData: updated.qr_code_data as string,
  };
};

export const listAppointmentsByChild = async (
  childId: string,
  userId: string
) => {
  return getAppointmentsByChild(childId, userId);
};

export const getAppointmentDetailsOfficial = async (appointmentId: string) => {
  return getAppointmentById(appointmentId);
};
