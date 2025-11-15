import { generateToken } from "../utils/jwtUtils.js";
import { sendSuccess, sendError, sendAuthError } from "../utils/responseUtils.js";
import dotenv from "dotenv";

dotenv.config();

export const googleAuthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      let isMobileApp = false;
      if (req.query.state) {
        try {
          const state = JSON.parse(req.query.state);
          isMobileApp = state.mobile === true;
        } catch (e) {
          console.error('Error parsing state:', e);
        }
      }
      
      const appScheme = process.env.APP_SCHEME || 'paisatrack';
      
      if (isMobileApp) {
        return res.redirect(`${appScheme}://auth/callback?error=authentication_failed`);
      }
      
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:8081"}/login?error=authentication_failed`,
      );
    }

    const token = generateToken(req.user);
    const { password, ...userWithoutPassword } = req.user;

    let isMobileApp = false;
    if (req.query.state) {
      try {
        const state = JSON.parse(req.query.state);
        isMobileApp = state.mobile === true;
        console.log('Parsed state from OAuth:', state);
      } catch (e) {
        console.error('Error parsing state:', e);
      }
    }
    
    const appScheme = process.env.APP_SCHEME || 'paisatrack';
    
    console.log('OAuth Success - isMobileApp:', isMobileApp, 'State:', req.query.state);
    
    if (isMobileApp) {
      const callbackUrl = `${appScheme}://auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userWithoutPassword))}`;
      console.log('Redirecting to mobile app:', callbackUrl);
      return res.redirect(callbackUrl);
    }

    // For web, redirect to frontend
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:8081"}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userWithoutPassword))}`,
    );
  } catch (error) {
    console.error("Google auth success error:", error);
    let isMobileApp = false;
    if (req.query.state) {
      try {
        const state = JSON.parse(req.query.state);
        isMobileApp = state.mobile === true;
      } catch (e) {
        console.error('Error parsing state:', e);
      }
    }
    
    const appScheme = process.env.APP_SCHEME || 'paisatrack';
    
    if (isMobileApp) {
      return res.redirect(`${appScheme}://auth/callback?error=server_error`);
    }
    
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:8081"}/login?error=server_error`,
    );
  }
};export const googleAuthFailure = (req, res) => {
  let isMobileApp = false;
  if (req.query.state) {
    try {
      const state = JSON.parse(req.query.state);
      isMobileApp = state.mobile === true;
    } catch (e) {
      console.error('Error parsing state:', e);
    }
  }
  
  const appScheme = process.env.APP_SCHEME || 'paisatrack';
  
  if (isMobileApp) {
    res.redirect(`${appScheme}://auth/callback?error=google_auth_failed`);
  } else {
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:8081"}/login?error=google_auth_failed`,
    );
  }
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error logging out",
      });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error destroying session",
        });
      }
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
};

export const getCurrentUser = (req, res) => {
  if (req.user) {
    const { password, ...userWithoutPassword } = req.user;
    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
};

export const googleAuthCallback = async (req, res) => {
  try {
    if (!req.user) {
      return sendAuthError(res, "Authentication failed");
    }

    const token = generateToken(req.user);
    const { password, ...userWithoutPassword } = req.user;

    return sendSuccess(res, 200, "Authentication successful", {
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Google auth callback error:", error);
    return sendError(res, 500, "Internal server error");
  }
};
