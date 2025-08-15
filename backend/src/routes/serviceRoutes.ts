import { Router } from "express";
import { getAllServices } from "../controllers/serviceController";
import { checkRole } from "../middleware/roleMiddleware";
import { RoleTypes } from "../types/roles";

const router = Router();

router.get(
  "/get-services",
  checkRole([
    RoleTypes.DOCTOR,
    RoleTypes.HOSPITAL_ADMIN,
    RoleTypes.NURSE,
    RoleTypes.PATIENT,
  ]),
  getAllServices
);
export default router;
