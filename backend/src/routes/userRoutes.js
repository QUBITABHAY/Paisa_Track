import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.get("/", getUser);
router.delete("/", deleteUser);

export default router;
