import { Router } from "express";
import {
  create,
  getAll,
  getAppointmentSummary,
  getUserAppointment,
} from "../controllers/appointmentController";

const router = Router();

router.post("/create", create);
router.get("/getAll/:service_id", getAll);
router.get("/get-appointment-summary", getAppointmentSummary);
router.get("/get-user-appointment/:user_id", getUserAppointment);

module.exports = router;
