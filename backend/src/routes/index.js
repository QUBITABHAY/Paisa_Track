import { Router } from "express";
import userRoutes from "./userRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import authRoutes from "./authRoutes.js";

const router = Router();


router.use("/api/auth", authRoutes);
router.use("/api/user", userRoutes);
router.use("/api/transactions", transactionRoutes);


router.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});

export default router;
