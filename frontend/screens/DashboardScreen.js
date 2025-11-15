import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  getCurrentMonthTransactions,
  calculateCategorySpending,
  compareMonthOverMonth,
  formatCurrency,
} from '../utils/analitics';
import { transactionAPI } from '../services/api';
import { getCategoriesMap } from '../constants/categories';
import { StatCard, QuickActionCard, BalanceCard, CategoryBreakdown } from '../components/dashboard';
import { TransactionItem } from '../components/transactions';

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState('');

  const categories = getCategoriesMap();

  // Load user data from AsyncStorage
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('auth_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserName(userData.username || userData.name || userData.email?.split('@')[0] || 'User');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
              navigation.replace('Login');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  // Calculate analytics
  const currentMonthTransactions = getCurrentMonthTransactions(transactions);
  const totalIncome = calculateTotalIncome(currentMonthTransactions);
  const totalExpenses = calculateTotalExpenses(currentMonthTransactions);
  const netBalance = calculateNetBalance(currentMonthTransactions);
  const monthComparison = compareMonthOverMonth(transactions);
  const categorySpending = calculateCategorySpending(currentMonthTransactions);
  
  // Get recent transactions (last 4)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);
  
  // Create category breakdown
  const categoryBreakdown = Object.entries(categorySpending)
    .map(([categoryKey, amount]) => {
      const category = categories[categoryKey] || categories.other;
      return {
        name: category.name,
        amount,
        color: category.color,
        percentage: (amount / totalExpenses) * 100,
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      if (response.data) {
        const transformedData = response.data.map(t => ({
          id: t.id,
          title: t.description,
          description: t.description,
          amount: t.amount,
          category: t.category?.toLowerCase() || 'other',
          date: new Date(t.date).toISOString().split('T')[0],
          type: t.type === 'EXPENSE' ? 'debit' : 'credit',
          paymentMethod: t.paymentMethod || 'Cash',
        }));
        setTransactions(transformedData);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTransactions();
  }, []);
  
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">Welcome back {userName}!</Text>
              <Text className="text-gray-600">Here's your financial overview</Text>
            </View>
            <TouchableOpacity 
              onPress={handleLogout}
              className="w-10 h-10 rounded-full bg-red-50 items-center justify-center ml-3"
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 shadow-lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-black opacity-90 text-sm font-medium">Total Balance</Text>
            </View>
            <Text className="text-black text-3xl font-bold mb-2">
              {formatCurrency(netBalance)}
            </Text>
            <View className="flex-row items-center">
              <Ionicons 
                name={monthComparison.change.balance >= 0 ? "trending-up" : "trending-down"} 
                size={16} 
                color={monthComparison.change.balance >= 0 ? "green" : "red"} 
              />
              <Text className={`text-sm ml-1 font-medium ${monthComparison.change.balance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                {monthComparison.change.balance >= 0 ? '+' : ''}{monthComparison.change.balance.toFixed(1)}% from last month
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-6 mb-6">
          <View className="flex-row">
            <StatCard
              title="This Month"
              value={formatCurrency(totalExpenses)}
              subtitle={`${currentMonth} spending`}
              icon="calendar"
              color="blue"
            />
            <StatCard
              title="Transactions"
              value={currentMonthTransactions.length.toString()}
              subtitle="Total transactions"
              icon="receipt"
              color="green"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row">
            <QuickActionCard
              icon="add-circle"
              title="Add Transaction"
              subtitle="Record payment"
              onPress={() => navigation.navigate("AddTransaction")}
              color="blue"
            />
            <QuickActionCard
              icon="stats-chart"
              title="View Analytics"
              subtitle="Spending insights"
              onPress={() => navigation.navigate("Analytics")}
              color="green"
            />
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-800">Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
              <Text className="text-blue-500 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.map((transaction) => {
            const category = categories[transaction.category] || categories.other;
            return (
              <TransactionItem 
                key={transaction.id} 
                transaction={{
                  ...transaction,
                  category: category.name,
                }} 
              />
            );
          })}
        </View>

        {/* Category Breakdown */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">Spending by Category</Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            {categoryBreakdown.length > 0 ? categoryBreakdown.map((category, index) => (
              <View key={index} className="mb-4 last:mb-0">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-semibold text-gray-800">{category.name}</Text>
                  <Text className="text-gray-600">{formatCurrency(category.amount)}</Text>
                </View>
                <View className="bg-gray-200 rounded-full h-2">
                  <View
                    className="h-2 rounded-full"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </View>
              </View>
            )) : (
              <Text className="text-gray-400 text-center py-4">No spending data available</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          onPress={() => navigation.navigate("AddTransaction")}
          className="bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;