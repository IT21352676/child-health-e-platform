import { Router } from "express";
import { checkRole } from "../middleware/roleMiddleware";
import { RoleTypes } from "../types/roles";
import { adminLogin, adminRegister } from "../controllers/govAuthController";

const router = Router();

router.post("/gov-login", adminLogin);

router.post(
  "/gov-register",
  checkRole([RoleTypes.HOSPITAL_ADMIN]),
  adminRegister
);

export default router;
