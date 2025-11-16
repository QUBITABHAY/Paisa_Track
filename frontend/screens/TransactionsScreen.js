import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { transactionAPI } from '../services/api';
import { getCategoriesMap } from '../constants/categories';
import { Button, EmptyState } from '../components/common';
import { TransactionItem } from '../components/transactions';
import { formatCurrency } from '../utils/analitics';

const TransactionsScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const categories = getCategoriesMap();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionAPI.getAll();
      const transformed = data.map(t => ({
        id: t.id,
        title: t.description,
        amount: parseFloat(t.amount),
        category: t.category.toLowerCase(),
        date: t.date.split('T')[0],
        type: t.type === 'EXPENSE' ? 'debit' : 'credit',
        paymentMethod: t.paymentMethod || 'UPI'
      }));
      
      setTransactions(transformed);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    fetchTransactions();
  }, []);

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
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await transactionAPI.delete(id);
              setTransactions(transactions.filter(t => t.id !== id));
              Alert.alert('Success', 'Transaction deleted successfully');
            } catch (error) {
              console.error('Error deleting transaction:', error);
              Alert.alert('Error', 'Failed to delete transaction');
            }
          },
        },
      ]
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
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-600 mt-4">Loading transactions...</Text>
          </View>
        ) : filteredTransactions.length > 0 ? (
          <>
            <Text className="text-gray-600 text-sm mb-4">
              Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              {sortBy === "amount" ? " (sorted by amount)" : " (sorted by date)"}
            </Text>
            {filteredTransactions.map((transaction) => {
              const category = categories[transaction.category] || categories.other;
              return (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={{
                    ...transaction,
                    category: category.name,
                    date: formatDate(transaction.date)
                  }}
                  showDelete={true}
                  onDelete={() => handleDeleteTransaction(transaction.id)}
                />
              );
            })}
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