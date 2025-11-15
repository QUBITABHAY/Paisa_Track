import prisma from "../config/db.config.js";
import bcrypt from "bcryptjs";
import { sendSuccess, sendError, sendValidationError, sendConflictError, sendAuthError } from "../utils/responseUtils.js";
import { isValidEmail, validatePassword, validateRequiredFields, sanitizeInput } from "../utils/validationUtils.js";
import { generateToken } from "../utils/jwtUtils.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const requiredValidation = validateRequiredFields(req.body, ['name', 'email', 'password']);
    if (!requiredValidation.isValid) {
      return sendValidationError(res, requiredValidation.message);
    }

    if (!isValidEmail(email)) {
      return sendValidationError(res, "Please provide a valid email address");
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return sendValidationError(res, passwordValidation.message);
    }

    const findUser = await prisma.users.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (findUser) {
      return sendConflictError(res, "Email already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.users.create({
      data: {
        username: sanitizeInput(name),
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return sendSuccess(res, 201, "User created successfully", {
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Create user error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const requiredValidation = validateRequiredFields(req.body, ['email', 'password']);
    if (!requiredValidation.isValid) {
      return sendValidationError(res, requiredValidation.message);
    }

    const user = await prisma.users.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return sendAuthError(res, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendAuthError(res, "Invalid email or password");
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return sendSuccess(res, 200, "Login successful", {
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return sendValidationError(res, "Email is required");
    }

    const result = await prisma.users.delete({ 
      where: { email: email.toLowerCase() } 
    });
    
    return sendSuccess(res, 200, "User deleted successfully");
  } catch (error) {
    console.error("Delete user error:", error);
    if (error.code === 'P2025') {
      return sendError(res, 404, "User not found");
    }
    return sendError(res, 500, "Internal server error");
  }
};
