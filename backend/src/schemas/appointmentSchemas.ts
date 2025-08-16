import { z } from "zod";

export const bookAppointmentSchema = z.object({
  childId: z.string().min(1, "childId is required"),
  serviceId: z.string().min(1, "serviceId is required"),
  healthCenterId: z.string().min(1, "healthCenterId is required"),
  appointmentDatetime: z
    .string()
    .datetime({ message: "appointmentDatetime must be ISO datetime" }),
});

export const childIdParamsSchema = z.object({
  childId: z.string().min(1, "childId is required"),
});

export const appointmentIdParamsSchema = z.object({
  appointmentId: z.string().min(1, "appointmentId is required"),
});
