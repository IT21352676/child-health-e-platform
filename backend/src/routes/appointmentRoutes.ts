import { Router } from "express";
import { create } from "../controllers/appointmentController";

const router = Router();

router.post("/create", create);

module.exports = router;
