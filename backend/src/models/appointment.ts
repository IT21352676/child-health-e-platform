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

// response interface for better type safety
interface GetAllAppointmentsResponse {
  success: boolean;
  data?: Appointment[];
  error?: string;
  count?: number;
}

// query options interface
interface AppointmentQueryOptions {
  limit?: number;
  offset?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  serviceId?: number;
  userId?: number;
  sortBy?: "created_at" | "appointment_datetime" | "status";
  sortOrder?: "asc" | "desc";
}

// Interface for client appointment response
interface ClientAppointmentResponse {
  success: boolean;
  data?: Appointment[] | any;
  error?: string;
  count?: number;
}

// Interface for query options
interface ClientAppointmentOptions {
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  limit?: number;
  offset?: number;
  upcoming?: boolean;
  sortBy?: "appointment_datetime" | "created_at" | "status";
  sortOrder?: "asc" | "desc";
}

export const createAnAppointment = async (
  appointmentData: Omit<Appointment, "appointment_id" | "qr_code_data">
): Promise<AppointmentCreateResponse> => {
  try {
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

    const qrCodeImage = await generateQRCode(JSON.stringify(qrData));

    if (!qrCodeImage) {
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

export const getAllAppointments = async (
  options: AppointmentQueryOptions = {}
): Promise<GetAllAppointmentsResponse> => {
  try {
    const {
      limit = 50,
      offset = 0,
      status,
      dateFrom,
      dateTo,
      serviceId,
      userId,
      sortBy = "created_at",
      sortOrder = "desc",
    } = options;

    let query = supabase.from("appointment").select(
      `
        *,
        user:user_id (
          user_id,
          first_name,
          last_name,
          email,
          phone_number
        ),
        service:service_id (
          service_id,
          name,
          description,
          department:department_id (
            department_id,
            name
          )
        ),
        confirmed_by_official:confirmed_by_official_id (
          official_id,
          first_name,
          last_name,
          role
        )
      `,
      { count: "exact" }
    );

    if (status) {
      query = query.eq("status", status);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    if (serviceId) {
      query = query.eq("service_id", serviceId);
    }

    if (dateFrom) {
      query = query.gte("appointment_datetime", dateFrom);
    }

    if (dateTo) {
      query = query.lte("appointment_datetime", dateTo);
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching appointments:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data || [],
      count: count || 0,
    };
  } catch (error: any) {
    console.error("Error in getAllAppointments:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred",
    };
  }
};

// Get appointments with summary statistics for admin dashboard
export const getAppointmentsSummary = async (): Promise<{
  success: boolean;
  data?: {
    totalAppointments: number;
    pendingAppointments: number;
    confirmedAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    todayAppointments: number;
    weekAppointments: number;
  };
  error?: string;
}> => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Get total count
    const { count: totalCount, error: totalError } = await supabase
      .from("appointment")
      .select("*", { count: "exact", head: true });

    if (totalError) throw totalError;

    // Get counts by status
    const { data: statusCounts, error: statusError } = await supabase
      .from("appointment")
      .select("status")
      .then(({ data, error }) => {
        if (error) throw error;

        const counts = {
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
        };

        data?.forEach((appointment) => {
          if (counts.hasOwnProperty(appointment.status)) {
            counts[appointment.status as keyof typeof counts]++;
          }
        });

        return { data: counts, error: null };
      });

    if (statusError) throw statusError;

    // Get today's appointments
    const { count: todayCount, error: todayError } = await supabase
      .from("appointment")
      .select("*", { count: "exact", head: true })
      .gte("appointment_datetime", `${today}T00:00:00Z`)
      .lt("appointment_datetime", `${today}T23:59:59Z`);

    if (todayError) throw todayError;

    // Get this week's appointments
    const { count: weekCount, error: weekError } = await supabase
      .from("appointment")
      .select("*", { count: "exact", head: true })
      .gte("appointment_datetime", weekStart.toISOString())
      .lte("appointment_datetime", weekEnd.toISOString());

    if (weekError) throw weekError;

    return {
      success: true,
      data: {
        totalAppointments: totalCount || 0,
        pendingAppointments: statusCounts?.pending || 0,
        confirmedAppointments: statusCounts?.confirmed || 0,
        completedAppointments: statusCounts?.completed || 0,
        cancelledAppointments: statusCounts?.cancelled || 0,
        todayAppointments: todayCount || 0,
        weekAppointments: weekCount || 0,
      },
    };
  } catch (error: any) {
    console.error("Error in getAppointmentsSummary:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get appointments for a specific user (client)
export const getUserAppointments = async (
  userId: number,
  options: ClientAppointmentOptions = {}
): Promise<ClientAppointmentResponse> => {
  try {
    const {
      status,
      limit = 20,
      offset = 0,
      upcoming = false,
      sortBy = "appointment_datetime",
      sortOrder = "asc",
    } = options;

    let query = supabase
      .from("appointment")
      .select(
        `
        appointment_id,
        reference_number,
        appointment_datetime,
        status,
        qr_code_data,
        created_at,
        service:service_id (
          service_id,
          name,
          description,
          avg_processing_time,
          department:department_id (
            department_id,
            name,
            description
          )
        ),
        confirmed_by_official:confirmed_by_official_id (
          official_id,
          first_name,
          last_name,
          role,
          email
        )
      `,
        { count: "exact" }
      )
      .eq("user_id", userId);

    if (status) {
      query = query.eq("status", status);
    }

    if (upcoming) {
      query = query.gte("appointment_datetime", new Date().toISOString());
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching user appointments:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data || [],
      count: count || 0,
    };
  } catch (error: any) {
    console.error("Error in getUserAppointments:", error);
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
