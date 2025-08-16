import { supabase } from "../utils/db";
import { AppointmentStatus } from "../types/appointmentStatus";

export interface InsertAppointmentArgs {
  userId: string;
  childId: string;
  serviceId: string;
  healthCenterId: string;
  appointmentDatetime: string; // ISO
  status: AppointmentStatus;
  referenceNumber: string;
  qrCodeData: string;
}

export const insertAppointment = async (args: InsertAppointmentArgs) => {
  const { data, error } = await supabase
    .from("appointments")
    .insert([
      {
        user_id: args.userId,
        child_id: args.childId,
        service_id: args.serviceId,
        health_center_id: args.healthCenterId,
        appointment_datetime: args.appointmentDatetime,
        status: args.status,
        reference_number: args.referenceNumber,
        qr_code_data: args.qrCodeData,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAppointmentsByChild = async (childId: string, userId: string) => {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `appointment_id, service_id, appointment_datetime, status, reference_number`
    )
    .eq("child_id", childId)
    .eq("user_id", userId)
    .order("appointment_datetime", { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getAppointmentById = async (appointmentId: string) => {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("appointment_id", appointmentId)
    .single();

  if (error) throw error;
  return data;
};

export const updateAppointmentQrCode = async (
  appointmentId: string,
  qrCodeData: string
) => {
  const { data, error } = await supabase
    .from("appointments")
    .update({ qr_code_data: qrCodeData })
    .eq("appointment_id", appointmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
