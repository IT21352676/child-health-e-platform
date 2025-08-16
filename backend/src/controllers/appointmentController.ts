import { Request, Response } from "express";
import {
  bookAppointment as bookAppointmentSvc,
  getAppointmentDetailsOfficial,
  listAppointmentsByChild,
} from "../services/appointmentService";

export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string } | undefined;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const result = await bookAppointmentSvc(user.id, req.body);

    return res.status(201).json({
      status: "success",
      message: "Appointment booked successfully.",
      data: result,
    });
  } catch (err: any) {
    console.error("bookAppointment error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAppointmentsForChild = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string } | undefined;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { childId } = req.params as { childId: string };
    const data = await listAppointmentsByChild(childId, user.id);
    return res.status(200).json({ status: "success", data });
  } catch (err: any) {
    console.error("getAppointmentsForChild error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAppointmentOfficial = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params as { appointmentId: string };
    const data = await getAppointmentDetailsOfficial(appointmentId);
    return res.status(200).json({ status: "success", data });
  } catch (err: any) {
    console.error("getAppointmentOfficial error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
