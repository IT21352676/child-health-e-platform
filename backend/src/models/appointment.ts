import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../utils/db";
import { Appointment } from "../types/appointment";

var QRCode = require("qrcode");

interface AppointmentCreateResponse {
  success: boolean;
  data?: Appointment;
  qrCode?: string;
  error?: string;
}

// Define QR code data structure
interface AppointmentQRData {
  appointmentId?: number;
  referenceNumber?: string;
  userId: number;
  serviceId: number;
  datetime: string;
  status: string;
  verificationUrl?: string;
  type: "appointment";
}

export const createAnAppointment = async (
  appointmentData: Omit<Appointment, "appointment_id" | "qr_code_data">
): Promise<AppointmentCreateResponse> => {
  try {
    // First, insert the appointment without QR code
    const { data: appointmentResponse, error: insertError } = await supabase
      .from("appointment")
      .insert([
        {
          user_id: appointmentData.user_id,
          service_id: appointmentData.service_id,
          confirmed_by_official_id: appointmentData.confirmed_by_official_id,
          appointment_datetime: appointmentData.appointment_datetime,
          status: appointmentData.status || "pending",
        },
      ])
      .select(
        `
        *,
        user:user_id (first_name, last_name, email),
        service:service_id (name, description, department:department_id (name))
      `
      )
      .single();

    if (insertError) {
      console.error("Error inserting appointment:", insertError);
      return {
        success: false,
        error: insertError.message,
      };
    }

    if (!appointmentResponse) {
      return {
        success: false,
        error: "No appointment data returned",
      };
    }

    // Generate QR code data with the actual appointment ID and reference number
    const qrData: AppointmentQRData = {
      type: "appointment",
      appointmentId: appointmentResponse.appointment_id,
      referenceNumber: appointmentResponse.reference_number,
      userId: appointmentResponse.user_id,
      serviceId: appointmentResponse.service_id,
      datetime: appointmentResponse.appointment_datetime,
      status: appointmentResponse.status,
      verificationUrl: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/verify/${appointmentResponse.reference_number}`,
    };

    // Generate QR code image
    const qrCodeImage = await generateQRCode(JSON.stringify(qrData));

    if (!qrCodeImage) {
      // Even if QR generation fails, the appointment was created successfully
      console.warn("QR code generation failed, but appointment was created");
      return {
        success: true,
        data: appointmentResponse,
        error: "Appointment created but QR code generation failed",
      };
    }

    // Update the appointment with QR code data
    const { error: updateError } = await supabase
      .from("appointment")
      .update({
        qr_code_data: JSON.stringify(qrData),
      })
      .eq("appointment_id", appointmentResponse.appointment_id);

    if (updateError) {
      console.error("Error updating QR code data:", updateError);
    }

    return {
      success: true,
      data: appointmentResponse,
      qrCode: qrCodeImage,
    };
  } catch (error: any) {
    console.error("Error in createAnAppointment:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred",
    };
  }
};

// QR Code generation function
const generateQRCode = async (qrData: string): Promise<string | null> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 256,
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
};

// Utility Function to verify QR code
export const verifyAppointmentQR = async (
  qrDataString: string
): Promise<{
  valid: boolean;
  appointment?: Appointment;
  error?: string;
}> => {
  try {
    const qrData: AppointmentQRData = JSON.parse(qrDataString);

    if (
      !qrData.appointmentId ||
      !qrData.referenceNumber ||
      qrData.type !== "appointment"
    ) {
      return {
        valid: false,
        error: "Invalid QR code format",
      };
    }

    const { data: appointment, error } = await supabase
      .from("appointment")
      .select(
        `
        *,
        user:user_id (first_name, last_name, email),
        service:service_id (name, description, department:department_id (name))
      `
      )
      .eq("appointment_id", qrData.appointmentId)
      .eq("reference_number", qrData.referenceNumber)
      .single();

    if (error || !appointment) {
      return {
        valid: false,
        error: "Appointment not found",
      };
    }

    return {
      valid: true,
      appointment,
    };
  } catch (error) {
    return {
      valid: false,
      error: "Invalid QR code data",
    };
  }
};
