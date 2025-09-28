import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  loginUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/", getUser);
router.delete("/", deleteUser);

export default router;
