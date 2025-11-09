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
  (req, res, next) => {
    // Pass mobile parameter through OAuth state parameter
    const isMobile = req.query.mobile === 'true';
    
    console.log('Initial request - mobile:', isMobile);
    
    // Pass state to Passport
    const authenticateOptions = {
      scope: ["profile", "email"],
      state: JSON.stringify({ mobile: isMobile })
    };
    
    passport.authenticate("google", authenticateOptions)(req, res, next);
  }
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
