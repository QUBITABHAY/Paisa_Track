import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID token is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const {
      sub: googleId,
      email,
      name,
      picture: avatar,
      email_verified: emailVerified,
    } = payload;

    if (!emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Google account email is not verified",
      });
    }

    let user = await prisma.users.findFirst({
      where: {
        OR: [{ googleId: googleId }, { email: email }],
      },
    });

    if (user) {
      if (!user.googleId) {
        user = await prisma.users.update({
          where: { id: user.id },
          data: {
            googleId: googleId,
            avatar: avatar,
            emailVerified: true,
          },
        });
      }
    } else {
      user = await prisma.users.create({
        data: {
          username: name,
          email: email,
          googleId: googleId,
          avatar: avatar,
          emailVerified: true,
          provider: "google",
        },
      });
    }

    const token = generateToken(user.id);

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      provider: user.provider || "google",
      emailVerified: user.emailVerified,
    };

    res.status(200).json({
      success: true,
      message: "Google authentication successful",
      data: {
        user: userData,
        token: token,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);

    if (error.message.includes("Token used too early")) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token timing",
      });
    }

    if (error.message.includes("Invalid token")) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during Google authentication",
    });
  }
};


export const linkGoogleAccount = async (req, res) => {
  try {
    const { idToken } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID token is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, picture: avatar } = payload;

    const existingUser = await prisma.users.findFirst({
      where: { googleId: googleId },
    });

    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({
        success: false,
        message: "This Google account is already linked to another user",
      });
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        googleId: googleId,
        avatar: avatar,
        emailVerified: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Google account linked successfully",
      data: {
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          googleId: updatedUser.googleId,
        },
      },
    });
  } catch (error) {
    console.error("Link Google Account Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to link Google account",
    });
  }
};

export const unlinkGoogleAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        googleId: null,
        avatar: null,
      },
    });

    res.status(200).json({
      success: true,
      message: "Google account unlinked successfully",
      data: {
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          googleId: updatedUser.googleId,
        },
      },
    });
  } catch (error) {
    console.error("Unlink Google Account Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to unlink Google account",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newToken = generateToken(userId);

    res.status(200).json({
      success: true,
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

export default {
  googleAuth,
  linkGoogleAccount,
  unlinkGoogleAccount,
  refreshToken,
};
