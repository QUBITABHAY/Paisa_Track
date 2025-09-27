import { Router } from "express";
import userRoutes from "./userRoutes.js";
import transactionRoutes from "./transactionRoutes.js";

const routes = Router();

routes.use("/api/user", userRoutes);
routes.use("/api/transaction", transactionRoutes);

export default routes;
