import { Router } from "express";
import userRoutes from "./userRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import authRoutes from "./authRoutes.js";

const routes = Router();

routes.use("/api/user", userRoutes);
routes.use("/api/transaction", transactionRoutes);
routes.use("/api/auth", authRoutes);

export default routes;
