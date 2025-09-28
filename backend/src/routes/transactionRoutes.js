import { Router } from "express";
import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from "../controllers/transactionController.js";

const router = Router();

router.post("/", createTransaction);
router.get("/", getTransactions);
router.put("/", updateTransaction);
router.delete("/", deleteTransaction);

export default router;