import prisma from "../config/db.config.js";

export const createTransaction = async (req, res) => {
    try {
        const { amount, description, userId } = req.body;
        const data = await prisma.transaction.create({
            data: {
                amount,
                description,
                userId
            }
        });
        res.send({ message: "Transaction Created Successfully", data: data });
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error" });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const { userId } = req.body;
        const data = await prisma.transaction.findMany({
            where: {
                userId: userId
            }
        });
        res.send({ message: "Transactions Fetched Successfully", data: data });
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error" }); 
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { transactionId, amount, description } = req.body;
        const checkDetil = await prisma.transaction.findUnique({
            where: {
                id: transactionId
            }
        });

        if (!checkDetil) {
            res.send({ message: "Transaction not found" });
        }

        const data = await prisma.transaction.update({
            where: {
                id: transactionId
            },
            data: {
                amount,
                description
            }
        });
        res.send({ message: "Transaction Updated Successfully", data: data });
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error" });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const result = await prisma.transaction.delete({ where: { id: transactionId } });
        if (!result) {
            res.send({ message: "Invalid Transaction" });
        }
        res.send({ message: "Transaction Deleted Successfully" });
    } catch (error) {
        res.send({ message: "Internal Server Error" });
    }
};