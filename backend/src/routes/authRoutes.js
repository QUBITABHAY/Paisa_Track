import { Router } from "express";
import passport from "../config/passport.config.js";
import {
  googleAuthSuccess,
  googleAuthFailure,
  googleAuthCallback,
  logout,
  getCurrentUser,
} from "../controllers/authController.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: true,
  }),
  googleAuthSuccess,
);

router.get(
  "/google/callback/json",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  googleAuthCallback,
);

router.get("/google/failure", googleAuthFailure);

router.post("/logout", logout);
router.get("/logout", logout);

router.get("/me", getCurrentUser);

export default router;
