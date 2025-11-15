// Analytics utility functions for transaction data analysis

export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
};

export const calculateTotalExpenses = (transactions) => {
  return transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
};

export const calculateNetBalance = (transactions) => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return income - expenses;
};

export const groupByCategory = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(transaction);
    return acc;
  }, {});
};

export const calculateCategorySpending = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'debit');
  return expenses.reduce((acc, transaction) => {
    const category = transaction.category || 'other';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(transaction.amount || 0);
    return acc;
  }, {});
};

export const calculateCategoryIncome = (transactions) => {
  const income = transactions.filter(t => t.type === 'credit');
  return income.reduce((acc, transaction) => {
    const category = transaction.category || 'other';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(transaction.amount || 0);
    return acc;
  }, {});
};


export const getTransactionsByDateRange = (transactions, startDate, endDate) => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

export const getCurrentMonthTransactions = (transactions) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return getTransactionsByDateRange(transactions, startOfMonth, endOfMonth);
};


export const getCurrentWeekTransactions = (transactions) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return getTransactionsByDateRange(transactions, startOfWeek, endOfWeek);
};

export const calculateDailyAverageSpending = (transactions, days = 30) => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - days);
  
  const recentTransactions = getTransactionsByDateRange(transactions, startDate, now);
  const totalSpending = calculateTotalExpenses(recentTransactions);
  
  return totalSpending / days;
};

export const getTopSpendingCategories = (transactions, limit = 5) => {
  const categorySpending = calculateCategorySpending(transactions);
  
  return Object.entries(categorySpending)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};

export const getMonthlySpendingTrend = (transactions, months = 6) => {
  const now = new Date();
  const monthlyData = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    
    const monthTransactions = getTransactionsByDateRange(transactions, startOfMonth, endOfMonth);
    const income = calculateTotalIncome(monthTransactions);
    const expenses = calculateTotalExpenses(monthTransactions);
    
    monthlyData.push({
      month: monthDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
      income,
      expenses,
      balance: income - expenses,
    });
  }
  
  return monthlyData;
};

export const getPaymentMethodDistribution = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const method = transaction.paymentMethod || 'Unknown';
    if (!acc[method]) {
      acc[method] = { count: 0, amount: 0 };
    }
    acc[method].count += 1;
    acc[method].amount += parseFloat(transaction.amount || 0);
    return acc;
  }, {});
};

export const calculateSavingsRate = (transactions) => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  
  if (income === 0) return 0;
  
  const savings = income - expenses;
  return (savings / income) * 100;
};

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigings: 0,
  }).format(amount);
};

export const getPercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const compareMonthOverMonth = (transactions) => {
  const now = new Date();
  
  // Current month
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const currentMonthTransactions = getTransactionsByDateRange(transactions, currentMonthStart, currentMonthEnd);
  
  // Previous month
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const previousMonthTransactions = getTransactionsByDateRange(transactions, previousMonthStart, previousMonthEnd);
  
  const currentIncome = calculateTotalIncome(currentMonthTransactions);
  const currentExpenses = calculateTotalExpenses(currentMonthTransactions);
  const previousIncome = calculateTotalIncome(previousMonthTransactions);
  const previousExpenses = calculateTotalExpenses(previousMonthTransactions);
  
  return {
    current: {
      income: currentIncome,
      expenses: currentExpenses,
      balance: currentIncome - currentExpenses,
    },
    previous: {
      income: previousIncome,
      expenses: previousExpenses,
      balance: previousIncome - previousExpenses,
    },
    change: {
      income: getPercentageChange(currentIncome, previousIncome),
      expenses: getPercentageChange(currentExpenses, previousExpenses),
      balance: getPercentageChange(currentIncome - currentExpenses, previousIncome - previousExpenses),
    },
  };
};

export const getBudgetStatus = (transactions, budgets) => {
  const currentMonthTransactions = getCurrentMonthTransactions(transactions);
  const categorySpending = calculateCategorySpending(currentMonthTransactions);
  
  return Object.keys(budgets).reduce((acc, category) => {
    const spent = categorySpending[category] || 0;
    const budget = budgets[category];
    const percentage = (spent / budget) * 100;
    
    acc[category] = {
      spent,
      budget,
      remaining: budget - spent,
      percentage,
      status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'safe',
    };
    
    return acc;
  }, {});
};

export default {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  groupByCategory,
  calculateCategorySpending,
  calculateCategoryIncome,
  getTransactionsByDateRange,
  getCurrentMonthTransactions,
  getCurrentWeekTransactions,
  calculateDailyAverageSpending,
  getTopSpendingCategories,
  getMonthlySpendingTrend,
  getPaymentMethodDistribution,
  calculateSavingsRate,
  formatCurrency,
  getPercentageChange,
  compareMonthOverMonth,
  getBudgetStatus,
};
