import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { transactionAPI } from '../services/api';
import { getCategoriesMap } from '../constants/categories';
import { Card } from '../components/common';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  getTopSpendingCategories,
  getMonthlySpendingTrend,
  calculateSavingsRate,
  getCurrentMonthTransactions,
  compareMonthOverMonth,
  formatCurrency,
} from '../utils/analitics';

const AnalyticsScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const categories = getCategoriesMap();

  const currentMonthTransactions = getCurrentMonthTransactions(transactions);
  const totalIncome = calculateTotalIncome(currentMonthTransactions);
  const totalExpenses = calculateTotalExpenses(currentMonthTransactions);
  const netBalance = calculateNetBalance(currentMonthTransactions);
  const savingsRate = calculateSavingsRate(currentMonthTransactions);
  const topCategories = getTopSpendingCategories(currentMonthTransactions, 5);
  const monthComparison = compareMonthOverMonth(transactions);
  const monthlyTrend = getMonthlySpendingTrend(transactions, 6);

  const PeriodSelector = () => (
    <View className="flex-row bg-gray-100 rounded-xl p-1 mb-6">
      {['week', 'month', 'year'].map((period) => (
        <TouchableOpacity
          key={period}
          onPress={() => setSelectedPeriod(period)}
          className={`flex-1 py-2 rounded-lg ${
            selectedPeriod === period ? 'bg-white shadow-sm' : 'bg-transparent'
          }`}
        >
          <Text
            className={`text-center font-semibold capitalize ${
              selectedPeriod === period ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            {period}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const OverviewCard = () => (
    <Card className="mb-4">
      <Text className="text-gray-600 text-sm mb-4">Financial Overview</Text>
      
      {/* Net Balance */}
      <View className="items-center mb-6 pb-6 border-b border-gray-100">
        <Text className="text-gray-500 text-sm mb-2">Net Balance</Text>
        <Text className={`text-4xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(Math.abs(netBalance))}
        </Text>
        {netBalance < 0 && <Text className="text-red-500 text-xs mt-1">Deficit</Text>}
      </View>

      {/* Income & Expenses */}
      <View className="flex-row justify-between">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center mb-2">
            <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-2">
              <Ionicons name="arrow-up" size={16} color="#10B981" />
            </View>
            <Text className="text-gray-600 text-sm">Income</Text>
          </View>
          <Text className="text-green-600 font-bold text-xl">
            {formatCurrency(totalIncome)}
          </Text>
          {monthComparison.change.income !== 0 && (
            <Text className={`text-xs mt-1 ${monthComparison.change.income > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {monthComparison.change.income > 0 ? '+' : ''}{monthComparison.change.income.toFixed(1)}% vs last month
            </Text>
          )}
        </View>

        <View className="flex-1 ml-2">
          <View className="flex-row items-center mb-2">
            <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-2">
              <Ionicons name="arrow-down" size={16} color="#EF4444" />
            </View>
            <Text className="text-gray-600 text-sm">Expenses</Text>
          </View>
          <Text className="text-red-600 font-bold text-xl">
            {formatCurrency(totalExpenses)}
          </Text>
          {monthComparison.change.expenses !== 0 && (
            <Text className={`text-xs mt-1 ${monthComparison.change.expenses > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {monthComparison.change.expenses > 0 ? '+' : ''}{monthComparison.change.expenses.toFixed(1)}% vs last month
            </Text>
          )}
        </View>
      </View>
    </Card>
  );

  const SavingsRateCard = () => (
    <Card className="mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-gray-600 text-sm font-semibold">Savings Rate</Text>
        <View className="flex-row items-center">
          <Ionicons name="trending-up" size={16} color="#10B981" />
          <Text className="text-green-600 font-bold text-lg ml-1">
            {savingsRate.toFixed(1)}%
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <View
          className={`h-full rounded-full ${
            savingsRate >= 50 ? 'bg-green-500' : savingsRate >= 20 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(savingsRate, 100)}%` }}
        />
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-400 text-xs">
          {savingsRate >= 50 ? 'Excellent!' : savingsRate >= 20 ? 'Good' : 'Need Improvement'}
        </Text>
        <Text className="text-gray-400 text-xs">
          Target: 50%
        </Text>
      </View>
    </Card>
  );

  const TopCategoriesCard = () => (
    <Card className="mb-4">
      <Text className="text-gray-600 text-sm font-semibold mb-4">Top Spending Categories</Text>
      
      {topCategories.length > 0 ? (
        topCategories.map((item, index) => {
          const category = categories[item.category] || categories.other;
          const percentage = (item.amount / totalExpenses) * 100;
          
          return (
            <View key={item.category} className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <Ionicons name={category.icon} size={18} color={category.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-medium">{category.name}</Text>
                    <Text className="text-gray-500 text-xs">{percentage.toFixed(1)}% of expenses</Text>
                  </View>
                </View>
                <Text className="text-gray-800 font-bold">{formatCurrency(item.amount)}</Text>
              </View>
              
              {/* Progress Bar */}
              <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: category.color 
                  }}
                />
              </View>
            </View>
          );
        })
      ) : (
        <Text className="text-gray-400 text-center py-4">No spending data available</Text>
      )}
    </Card>
  );

  const MonthlyTrendCard = () => (
    <Card className="mb-4">
      <Text className="text-gray-600 text-sm font-semibold mb-4">6-Month Trend</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row items-end" style={{ height: 200 }}>
          {monthlyTrend.map((month, index) => {
            const maxValue = Math.max(...monthlyTrend.map(m => Math.max(m.income, m.expenses)));
            const incomeHeight = (month.income / maxValue) * 150;
            const expenseHeight = (month.expenses / maxValue) * 150;
            
            return (
              <View key={index} className="items-center mr-4" style={{ width: 50 }}>
                <View className="flex-row items-end mb-2" style={{ height: 150 }}>
                  {/* Income Bar */}
                  <View className="flex-1 mr-1">
                    <View
                      className="bg-green-500 rounded-t-lg w-full"
                      style={{ height: incomeHeight }}
                    />
                  </View>
                  {/* Expense Bar */}
                  <View className="flex-1 ml-1">
                    <View
                      className="bg-red-500 rounded-t-lg w-full"
                      style={{ height: expenseHeight }}
                    />
                  </View>
                </View>
                <Text className="text-gray-600 text-xs text-center">{month.month}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Legend */}
      <View className="flex-row justify-center mt-4 pt-4 border-t border-gray-100">
        <View className="flex-row items-center mr-6">
          <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
          <Text className="text-gray-600 text-xs">Income</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
          <Text className="text-gray-600 text-xs">Expenses</Text>
        </View>
      </View>
    </Card>
  );

  const InsightsCard = () => {
    const insights = [];
    
    if (savingsRate < 20) {
      insights.push({
        icon: 'warning',
        color: '#EF4444',
        title: 'Low Savings Rate',
        description: 'Your savings rate is below 20%. Try to reduce expenses.',
      });
    }
    
    if (monthComparison.change.expenses > 20) {
      insights.push({
        icon: 'alert-circle',
        color: '#F59E0B',
        title: 'Spending Increase',
        description: `Your expenses increased by ${monthComparison.change.expenses.toFixed(1)}% this month.`,
      });
    }
    
    if (topCategories.length > 0 && (topCategories[0].amount / totalExpenses) > 0.4) {
      insights.push({
        icon: 'pie-chart',
        color: '#3B82F6',
        title: 'High Category Spending',
        description: `${(categories[topCategories[0].category] || categories.other).name} accounts for ${((topCategories[0].amount / totalExpenses) * 100).toFixed(1)}% of your expenses.`,
      });
    }
    
    if (savingsRate >= 50) {
      insights.push({
        icon: 'checkmark-circle',
        color: '#10B981',
        title: 'Excellent Savings!',
        description: 'You\'re saving more than 50% of your income. Keep it up!',
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: 'happy',
        color: '#10B981',
        title: 'Looking Good!',
        description: 'Your finances are in good shape. Keep tracking!',
      });
    }

    return (
      <Card className="mb-4">
        <Text className="text-gray-600 text-sm font-semibold mb-4">Insights & Tips</Text>
        
        {insights.map((insight, index) => (
          <View key={index} className="flex-row items-start mb-4 last:mb-0">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: insight.color + '20' }}
            >
              <Ionicons name={insight.icon} size={20} color={insight.color} />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-semibold mb-1">{insight.title}</Text>
              <Text className="text-gray-600 text-sm">{insight.description}</Text>
            </View>
          </View>
        ))}
      </Card>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white px-5 py-4 flex-row items-center justify-between border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Analytics</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
          <Ionicons name="list" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 py-6" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-600 mt-4">Loading analytics...</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="analytics-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-600 mt-4 text-center">No transactions yet</Text>
            <Text className="text-gray-400 text-sm text-center mt-2">
              Start adding transactions to see analytics
            </Text>
          </View>
        ) : (
          <>
            <PeriodSelector />
            <OverviewCard />
            <SavingsRateCard />
            <TopCategoriesCard />
            <MonthlyTrendCard />
            <InsightsCard />
            <View className="h-4" />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;
