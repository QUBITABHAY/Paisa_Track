import { Router } from "express";
import { 
  createTransaction, 
  getTransactions, 
  updateTransaction, 
  deleteTransaction 
} from "../controllers/transactionController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;