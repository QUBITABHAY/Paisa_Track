import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
};

export const googleAuthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:8081"}/login?error=authentication_failed`,
      );
    }

    const token = generateToken(req.user);

    const { password, ...userWithoutPassword } = req.user;

    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:8081"}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userWithoutPassword))}`,
    );
  } catch (error) {
    console.error("Google auth success error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:8081"}/login?error=server_error`,
    );
  }
};

export const googleAuthFailure = (req, res) => {
  res.redirect(
    `${process.env.FRONTEND_URL || "http://localhost:8081"}/login?error=google_auth_failed`,
  );
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
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }

    const token = generateToken(req.user);

    const { password, ...userWithoutPassword } = req.user;

    res.json({
      success: true,
      message: "Authentication successful",
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Google auth callback error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
