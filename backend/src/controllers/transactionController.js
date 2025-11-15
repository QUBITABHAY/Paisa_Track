import prisma from "../config/db.config.js";
import { sendSuccess, sendError, sendValidationError, sendNotFoundError } from "../utils/responseUtils.js";
import { validateRequiredFields } from "../utils/validationUtils.js";

export const createTransaction = async (req, res) => {
    try {
        const { amount, description, type, category, paymentMethod, date } = req.body;
        
        const requiredValidation = validateRequiredFields(req.body, ['amount', 'description']);
        if (!requiredValidation.isValid) {
            return sendValidationError(res, requiredValidation.message);
        }

        const data = await prisma.transaction.create({
            data: {
                amount: parseFloat(amount),
                description,
                userId: req.userId,
                type: type || 'EXPENSE',
                category: category || 'other',
                paymentMethod: paymentMethod || 'Cash',
                date: date ? new Date(date) : new Date()
            }
        });
        
        return sendSuccess(res, 201, "Transaction created successfully", data);
    } catch (error) {
        console.error("Create transaction error:", error);
        return sendError(res, 500, "Internal server error");
    }
};

export const getTransactions = async (req, res) => {
    try {
        const data = await prisma.transaction.findMany({
            where: { userId: req.userId },
            orderBy: { date: 'desc' }
        });
        
        return sendSuccess(res, 200, "Transactions fetched successfully", data);
    } catch (error) {
        console.error("Get transactions error:", error);
        return sendError(res, 500, "Internal server error");
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, type, category, paymentMethod, date } = req.body;
        
        if (!id) {
            return sendValidationError(res, "Transaction ID is required");
        }

        const existingTransaction = await prisma.transaction.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingTransaction) {
            return sendNotFoundError(res, "Transaction not found");
        }

        const updateData = {};
        if (amount !== undefined) updateData.amount = parseFloat(amount);
        if (description !== undefined) updateData.description = description;
        if (type !== undefined) updateData.type = type;
        if (category !== undefined) updateData.category = category;
        if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
        if (date !== undefined) updateData.date = new Date(date);

        const data = await prisma.transaction.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        
        return sendSuccess(res, 200, "Transaction updated successfully", data);
    } catch (error) {
        console.error("Update transaction error:", error);
        return sendError(res, 500, "Internal server error");
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return sendValidationError(res, "Transaction ID is required");
        }

        await prisma.transaction.delete({ 
            where: { id: parseInt(id) } 
        });
        
        return sendSuccess(res, 200, "Transaction deleted successfully");
    } catch (error) {
        console.error("Delete transaction error:", error);
        if (error.code === 'P2025') {
            return sendNotFoundError(res, "Transaction not found");
        }
        return sendError(res, 500, "Internal server error");
    }
};