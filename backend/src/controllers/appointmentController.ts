import { Request, Response } from "express";
import {
  createAnAppointment,
  getAllAppointments,
  getAppointmentsSummary,
  getUserAppointments,
  verifyAppointmentQR,
} from "../models/appointment";
import { Appointment } from "../types/appointment";
import { Status } from "../types/status";

export const create = async (req: Request, res: Response) => {
  try {
    const {
      user_id,
      service_id,
      confirmed_by_official_id,
      appointment_datetime,
      status = Status.PENDING,
    } = req.body;

    if (!user_id || !service_id || !appointment_datetime) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: user_id, service_id, and appointment_datetime are required",
      });
    }

    // Validate data types
    if (typeof user_id !== "number" || typeof service_id !== "number") {
      return res.status(400).json({
        success: false,
        error: "user_id and service_id must be numbers",
      });
    }

    // Validate appointment datetime format
    const appointmentDate = new Date(appointment_datetime);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid appointment_datetime format. Use ISO 8601 format (e.g., 2024-08-20T10:30:00Z)",
      });
    }

    // Check if appointment is in the future
    if (appointmentDate <= new Date()) {
      return res.status(400).json({
        success: false,
        error: "Appointment datetime must be in the future",
      });
    }

    const appointmentData: Omit<Appointment, "appointment_id"> = {
      user_id,
      service_id,
      confirmed_by_official_id: confirmed_by_official_id || null,
      appointment_datetime,
      status,
      qr_code_data: null,
    };

    // Call the service function
    const result = await createAnAppointment(appointmentData);

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        data: {
          appointment: result.data,
          qr_code: result.qrCode,
        },
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || "Failed to create appointment",
      });
    }
  } catch (error: any) {
    console.error("Error in appointment create controller:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get all appointment controller
export const getAll = async (req: Request, res: Response) => {
  try {
    const { service_id } = req.params;
    const response = await getAllAppointments({
      serviceId: parseInt(service_id),
    });
    if (response.success) {
      return res.status(201).json({
        success: true,
        data: response.data,
        message: "Fetched all appointments data",
      });
    } else {
      return res.status(500).json({
        success: false,
        error: response.error || "Failed to fetch appointment",
      });
    }
  } catch (error: any) {
    console.error("Error in appointment fetch all controller:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get appointments with summary controller
export const getAppointmentSummary = async (req: Request, res: Response) => {
  try {
    const response = await getAppointmentsSummary();
    if (response.success) {
      return res.status(201).json({
        success: true,
        data: response.data,
        message: "Fetched all summary data",
      });
    } else {
      return res.status(500).json({
        success: false,
        error: response.error || "Failed to fetch appointment summary",
      });
    }
  } catch (error: any) {
    console.error("Error in appointment get summary controller:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get appointment for a specific user
export const getUserAppointment = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const response = await getUserAppointments(parseInt(user_id));
    if (response.success) {
      return res.status(201).json({
        success: true,
        data: response.data,
      });
    } else {
      return res.status(201).json({
        success: false,
        message: response.error || "Failed to fetch appointments by user",
      });
    }
  } catch (error: any) {
    console.error("Error in appointment get by user controller:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
