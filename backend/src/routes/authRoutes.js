import { Router } from "express";
import passport from "../config/passport.config.js";
import {
  googleMobileAuth,
  logout,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/google-mobile", googleMobileAuth);
router.post("/logout", authenticate, logout);
router.get("/logout", authenticate, logout);
router.get("/me", authenticate, getCurrentUser);

export default router;
