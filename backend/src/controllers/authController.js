import { generateToken } from "../utils/jwtUtils.js";
import { sendSuccess, sendError, sendAuthError } from "../utils/responseUtils.js";
import axios from "axios";
import prisma from "../config/db.config.js";
import dotenv from "dotenv";

dotenv.config();

export const googleMobileAuth = async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return sendAuthError(res, "Authorization code is required");
    }

    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_WEB_CLIENT_ID,
      client_secret: process.env.GOOGLE_WEB_CLIENT_SECRET,
      redirect_uri: redirectUri || "",
      grant_type: "authorization_code",
    });

    const { access_token, id_token } = tokenResponse.data;

    const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const profile = userResponse.data;

    let user = await prisma.users.findUnique({
      where: { googleId: profile.id },
    });

    if (!user) {
      user = await prisma.users.findUnique({
        where: { email: profile.email },
      });

      if (user) {
        user = await prisma.users.update({
          where: { id: user.id },
          data: {
            googleId: profile.id,
            provider: "google",
            avatar: profile.picture || null,
            emailVerified: true,
          },
        });
      } else {
        user = await prisma.users.create({
          data: {
            googleId: profile.id,
            email: profile.email,
            username: profile.name,
            avatar: profile.picture || null,
            provider: "google",
            emailVerified: true,
            password: null,
          },
        });
      }
    }

    const token = generateToken(user);
    const { password, ...userWithoutPassword } = user;

    return sendSuccess(res, 200, "Authentication successful", {
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error("Google mobile auth error:", error?.response?.data || error.message);
    return sendError(res, 500, "Google authentication failed");
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
