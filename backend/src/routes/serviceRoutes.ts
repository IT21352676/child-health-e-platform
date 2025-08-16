import { Router } from "express";
import {
  bookService,
  viewAllServiceTypes,
  viewServiceByPatient,
  viewServiceByProvider,
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

router.get(
  "/view-patient-services/:patient_id",
  checkRole([RoleTypes.HOSPITAL_ADMIN, RoleTypes.PATIENT]),
  viewServiceByPatient
);

router.get(
  "/view-provider-services/:provider_id",
  checkRole([RoleTypes.HOSPITAL_ADMIN, RoleTypes.DOCTOR]),
  viewServiceByProvider
);

export default router;
