import { Router } from "express";
import { login, register } from "../controllers/authController";
import { checkRole } from "../middleware/roleMiddleware";
import { RoleTypes } from "../types/roles";

const router = Router();

router.post("/login", login);

router.post("/register", checkRole([RoleTypes.HOSPITAL_ADMIN]), register);

router.get("/admin", checkRole([RoleTypes.HOSPITAL_ADMIN]), (req, res) => {
  res.send("Welcome Hospital Admin");
});

router.get("/doctor", checkRole([RoleTypes.DOCTOR]), (req, res) => {
  res.send("Welcome Doctor");
});

router.get("/nurse", checkRole([RoleTypes.NURSE]), (req, res) => {
  res.send("Welcome Nurse");
});

router.get("/patient", checkRole([RoleTypes.PATIENT]), (req, res) => {
  res.send("Welcome Patient");
});

export default router;
