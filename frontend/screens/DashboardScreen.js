import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    // Dummy data;
    totalSpent: 12450,
    thisMonth: 3200,
    transactionCount: 47,
    recentTransactions: [
      { id: 1, title: "Grocery Shopping", amount: 450, category: "Food", date: "2025-09-26", type: "debit" },
      { id: 2, title: "Salary Received", amount: 25000, category: "Income", date: "2025-09-25", type: "credit" },
      { id: 3, title: "Coffee", amount: 120, category: "Food", date: "2025-09-25", type: "debit" },
      { id: 4, title: "Bus Ticket", amount: 85, category: "Transport", date: "2025-09-24", type: "debit" },
    ],
    categoryBreakdown: [
      { name: "Food", amount: 1200, color: "#FF6B6B", percentage: 37.5 },
      { name: "Transport", amount: 800, color: "#4ECDC4", percentage: 25 },
      { name: "Shopping", amount: 600, color: "#45B7D1", percentage: 18.75 },
      { name: "Bills", amount: 400, color: "#96CEB4", percentage: 12.5 },
      { name: "Others", amount: 200, color: "#FFEAA7", percentage: 6.25 },
    ]
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const user = { name: "Abhay" }; // Dummy user data

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const QuickActionCard = ({ icon, title, subtitle, onPress, color = "blue" }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 mx-1`}
    >
      <View className={`w-12 h-12 bg-${color}-100 rounded-full items-center justify-center mb-3`}>
        <Ionicons name={icon} size={24} color={color === "blue" ? "#3B82F6" : color === "green" ? "#10B981" : "#8B5CF6"} />
      </View>
      <Text className="font-bold text-gray-800 text-sm">{title}</Text>
      <Text className="text-gray-500 text-xs">{subtitle}</Text>
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 mx-1">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-600 text-sm font-medium">{title}</Text>
        <View className={`w-8 h-8 bg-${color}-100 rounded-full items-center justify-center`}>
          <Ionicons name={icon} size={16} color={color === "blue" ? "#3B82F6" : color === "green" ? "#10B981" : "#EF4444"} />
        </View>
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-1">{value}</Text>
      <Text className="text-gray-500 text-xs">{subtitle}</Text>
    </View>
  );

  const TransactionItem = ({ transaction }) => (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className={`w-10 h-10 rounded-full items-center justify-center ${
            transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <Ionicons 
              name={transaction.type === 'credit' ? "arrow-down" : "arrow-up"} 
              size={16} 
              color={transaction.type === 'credit' ? "#10B981" : "#EF4444"} 
            />
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-gray-800">{transaction.title}</Text>
            <Text className="text-gray-500 text-sm">{transaction.category} • {transaction.date}</Text>
          </View>
        </View>
        <Text className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
      </View>
    </View>
  );

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
            <View>
              <Text className="text-2xl font-bold text-gray-800">Welcome back {user.name}!</Text>
              <Text className="text-gray-600">Here's your financial overview</Text>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
              <Ionicons name="notifications-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 shadow-lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-black opacity-90 text-sm font-medium">Total Balance</Text>
              <Ionicons name="eye-outline" size={20} color="black" />
            </View>
            <Text className="text-black text-3xl font-bold mb-2">
              {formatCurrency(dashboardData.totalSpent)}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="trending-up" size={16} color="green" />
              <Text className="text-green-900 text-sm ml-1 font-medium">+12.5% from last month</Text>  {/* change */}
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-6 mb-6">
          <View className="flex-row">
            <StatCard
              title="This Month"
              value={formatCurrency(dashboardData.thisMonth)}
              subtitle="September spending"  /*update this dynamically*/
              icon="calendar"
              color="blue"
            />
            <StatCard
              title="Transactions"
              value={dashboardData.transactionCount.toString()}
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
            <QuickActionCard
              icon="card"
              title="Categories"
              subtitle="Manage categories"
              onPress={() => navigation.navigate("Categories")}
              color="purple"
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
          {dashboardData.recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </View>

        {/* Category Breakdown */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">Spending by Category</Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            {dashboardData.categoryBreakdown.map((category, index) => (
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
            ))}
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