import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Balance Card Component
 * Displays total balance with trend indicator
 */
const BalanceCard = ({ 
  balance, 
  trend, 
  trendPercentage,
  formatCurrency 
}) => (
  <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 shadow-lg">
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-black opacity-90 text-sm font-medium">Total Balance</Text>
      <Ionicons name="eye-outline" size={20} color="black" />
    </View>
    <Text className="text-black text-3xl font-bold mb-2">
      {formatCurrency(balance)}
    </Text>
    <View className="flex-row items-center">
      <Ionicons
        name={trend >= 0 ? 'trending-up' : 'trending-down'}
        size={16}
        color={trend >= 0 ? 'green' : 'red'}
      />
      <Text
        className={`text-sm ml-1 font-medium ${
          trend >= 0 ? 'text-green-900' : 'text-red-900'
        }`}
      >
        {trend >= 0 ? '+' : ''}
        {trendPercentage}% from last month
      </Text>
    </View>
  </View>
);

export default BalanceCard;
