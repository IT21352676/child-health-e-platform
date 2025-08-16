import { Router } from "express";
import { checkUser } from "../middleware/userMiddleware";
import {
  fetchUserDetails,
  userDetailsUpdate,
  userLogin,
  userRegister,
} from "../controllers/userController";

const router = Router();

router.post("/user-login", userLogin);

router.post("/user-register", userRegister);

router.put("/user-update", checkUser(), userDetailsUpdate);

router.get("/user-get", checkUser(), fetchUserDetails);

export default router;
