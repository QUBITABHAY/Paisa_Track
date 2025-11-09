import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card, Badge, EmptyState, Button } from "../components/UI";

const TransactionsScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([
    { id: 1, title: "Grocery Shopping", amount: 450, category: "food", date: "2025-09-26", type: "debit", paymentMethod: "UPI" },
    { id: 2, title: "Salary Received", amount: 25000, category: "income", date: "2025-09-25", type: "credit", paymentMethod: "Bank Transfer" },
    { id: 3, title: "Coffee", amount: 120, category: "food", date: "2025-09-25", type: "debit", paymentMethod: "UPI" },
    { id: 4, title: "Bus Ticket", amount: 85, category: "transport", date: "2025-09-24", type: "debit", paymentMethod: "Card" },
    { id: 5, title: "Movie Tickets", amount: 500, category: "entertainment", date: "2025-09-23", type: "debit", paymentMethod: "UPI" },
    { id: 6, title: "Freelance Work", amount: 5000, category: "income", date: "2025-09-22", type: "credit", paymentMethod: "UPI" },
    { id: 7, title: "Electricity Bill", amount: 1200, category: "bills", date: "2025-09-21", type: "debit", paymentMethod: "Net Banking" },
    { id: 8, title: "Gym Membership", amount: 2000, category: "health", date: "2025-09-20", type: "debit", paymentMethod: "UPI" },
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); // all, debit, credit
  const [sortBy, setSortBy] = useState("date"); // date, amount

  const categories = {
    food: { name: "Food", icon: "restaurant", color: "#FF6B6B" },
    transport: { name: "Transport", icon: "car", color: "#4ECDC4" },
    shopping: { name: "Shopping", icon: "bag", color: "#45B7D1" },
    bills: { name: "Bills", icon: "receipt", color: "#96CEB4" },
    entertainment: { name: "Entertainment", icon: "game-controller", color: "#FFEAA7" },
    health: { name: "Health", icon: "fitness", color: "#FD79A8" },
    education: { name: "Education", icon: "book", color: "#A29BFE" },
    income: { name: "Income", icon: "trending-up", color: "#00B894" },
    other: { name: "Other", icon: "ellipsis-horizontal", color: "#636E72" },
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      if (filter === "all") return true;
      return transaction.type === filter;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
      } else {
        return b.amount - a.amount;
      }
    });

  const handleDeleteTransaction = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTransactions(transactions.filter(t => t.id !== id));
          },
        },
      ]
    );
  };

  const TransactionItem = ({ transaction }) => {
    const category = categories[transaction.category] || categories.other;
    
    return (
      <Card className="p-4 mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: category.color + "20" }}
            >
              <Ionicons name={category.icon} size={20} color={category.color} />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800 text-base">{transaction.title}</Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-gray-500 text-sm">{category.name}</Text>
                <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                <Text className="text-gray-500 text-sm">{formatDate(transaction.date)}</Text>
              </View>
              <Text className="text-gray-400 text-xs mt-1">{transaction.paymentMethod}</Text>
            </View>
          </View>
          <View className="items-end">
            <Text
              className={`font-bold text-lg ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </Text>
            <TouchableOpacity
              onPress={() => handleDeleteTransaction(transaction.id)}
              className="mt-2 p-2"
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  const FilterButton = ({ title, value, isActive }) => (
    <TouchableOpacity
      onPress={() => setFilter(value)}
      className={`px-4 py-2 rounded-full mr-3 ${
        isActive ? "bg-blue-500" : "bg-gray-200"
      }`}
    >
      <Text
        className={`font-medium ${
          isActive ? "text-white" : "text-gray-600"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddTransaction")}>
          <Ionicons name="add" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View className="px-6 py-4 bg-white border-b border-gray-100">
        <View className="flex-row justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-gray-600 text-sm">Total Income</Text>
            <Text className="text-green-600 font-bold text-lg">
              +{formatCurrency(transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0))}
            </Text>
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-600 text-sm">Total Expenses</Text>
            <Text className="text-red-600 font-bold text-lg">
              -{formatCurrency(transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0))}
            </Text>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
            <FilterButton title="All" value="all" isActive={filter === "all"} />
            <FilterButton title="Expenses" value="debit" isActive={filter === "debit"} />
            <FilterButton title="Income" value="credit" isActive={filter === "credit"} />
          </ScrollView>
          <TouchableOpacity
            onPress={() => setSortBy(sortBy === "date" ? "amount" : "date")}
            className="ml-4 p-2"
          >
            <Ionicons name="swap-vertical" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView
        className="flex-1 px-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {filteredTransactions.length > 0 ? (
          <>
            <Text className="text-gray-600 text-sm mb-4">
              Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              {sortBy === "amount" ? " (sorted by amount)" : " (sorted by date)"}
            </Text>
            {filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </>
        ) : (
          <EmptyState
            icon="receipt-outline"
            title="No transactions found"
            subtitle={`No ${filter === "all" ? "" : filter === "debit" ? "expense" : "income"} transactions to show.`}
            actionButton={
              <Button
                title="Add Transaction"
                onPress={() => navigation.navigate("AddTransaction")}
                icon="add"
              />
            }
          />
        )}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionsScreen;