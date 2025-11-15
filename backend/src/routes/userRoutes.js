import { Router } from "express";
import {
  createUser,
  deleteUser,
  loginUser,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);

router.delete("/", authenticate, deleteUser);

export default router;
