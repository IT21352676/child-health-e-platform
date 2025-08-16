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

// router.get("/admin", checkRole([RoleTypes.HOSPITAL_ADMIN]), (req, res) => {
//   res.send("Welcome Hospital Admin");
// });

// router.get("/doctor", checkRole([RoleTypes.DOCTOR]), (req, res) => {
//   res.send("Welcome Doctor");
// });

// router.get("/nurse", checkRole([RoleTypes.NURSE]), (req, res) => {
//   res.send("Welcome Nurse");
// });

// router.get("/patient", checkRole([RoleTypes.PATIENT]), (req, res) => {
//   res.send("Welcome Patient");
// });

export default router;
