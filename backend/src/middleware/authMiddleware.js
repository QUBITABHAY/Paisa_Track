import { verifyToken, extractTokenFromHeader } from '../utils/jwtUtils.js';
import { sendAuthError } from '../utils/responseUtils.js';
import prisma from '../config/db.config.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return sendAuthError(res, "No token provided");
    }
    
    const decoded = verifyToken(token);
    
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        googleId: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return sendAuthError(res, "User not found");
    }
    
    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return sendAuthError(res, "Invalid or expired token");
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (token) {
      const decoded = verifyToken(token);
      const user = await prisma.users.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          email: true
        }
      });
      
      if (user) {
        req.user = user;
        req.userId = user.id;
      }
    }
  } catch (error) {
    console.log("Optional auth failed:", error.message);
  }
  
  next();
};
