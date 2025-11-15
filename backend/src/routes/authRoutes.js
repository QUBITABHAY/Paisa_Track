import { Router } from "express";
import passport from "../config/passport.config.js";
import {
  googleAuthSuccess,
  googleAuthFailure,
  googleAuthCallback,
  logout,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/google",
  (req, res, next) => {
    const isMobile = req.query.mobile === 'true';
    
    console.log('Google OAuth - mobile:', isMobile);
    
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
  googleAuthSuccess
);

router.get(
  "/google/callback/json",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  googleAuthCallback
);

router.get("/google/failure", googleAuthFailure);

router.post("/logout", authenticate, logout);
router.get("/logout", authenticate, logout);
router.get("/me", authenticate, getCurrentUser);

export default router;
