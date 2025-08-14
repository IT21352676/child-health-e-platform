import { Router } from "express";
import {
  bookService,
  viewAllServiceTypes,
  viewService,
} from "../controllers/serviceController";
import { checkRole } from "../middleware/roleMiddleware";
import { RoleTypes } from "../types/roles";

const router = Router();

router.get(
  "/view-all-services-types",
  checkRole([
    RoleTypes.DOCTOR,
    RoleTypes.HOSPITAL_ADMIN,
    RoleTypes.NURSE,
    RoleTypes.PATIENT,
  ]),
  viewAllServiceTypes
);
router.post(
  "/book-a-service",
  checkRole([
    RoleTypes.DOCTOR,
    RoleTypes.HOSPITAL_ADMIN,
    RoleTypes.NURSE,
    RoleTypes.PATIENT,
  ]),
  bookService
);

router.get(
  "/view-patient-services/:patient_id",
  checkRole([RoleTypes.HOSPITAL_ADMIN, RoleTypes.PATIENT]),
  viewService
);

export default router;
