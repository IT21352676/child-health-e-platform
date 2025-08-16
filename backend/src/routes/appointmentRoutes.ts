import { Router } from "express";
import { checkRole } from "../middleware/roleMiddleware";
import { RoleTypes } from "../types/roles";
import {
  bookAppointment,
  getAppointmentOfficial,
  getAppointmentsForChild,
} from "../controllers/appointmentController";
import { validateBody, validateParams } from "../middleware/validate";
import {
  appointmentIdParamsSchema,
  bookAppointmentSchema,
  childIdParamsSchema,
} from "../schemas/appointmentSchemas";

const router = Router();

// POST /secured/appointments
router.post(
  "/appointments",
  checkRole([RoleTypes.PATIENT]),
  validateBody(bookAppointmentSchema),
  bookAppointment
);

// GET /secured/children/:childId/appointments
router.get(
  "/children/:childId/appointments",
  checkRole([RoleTypes.PATIENT]),
  validateParams(childIdParamsSchema),
  getAppointmentsForChild
);

// GET /secured/officer/appointments/:appointmentId
router.get(
  "/officer/appointments/:appointmentId",
  checkRole([RoleTypes.HOSPITAL_ADMIN, RoleTypes.DOCTOR]),
  validateParams(appointmentIdParamsSchema),
  getAppointmentOfficial
);

export default router;
