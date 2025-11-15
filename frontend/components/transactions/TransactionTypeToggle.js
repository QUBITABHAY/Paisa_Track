import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Transaction Type Toggle Component
 * Toggle between expense and income types
 */
const TransactionTypeToggle = ({ 
  type, 
  onChange,
  className = '' 
}) => (
  <View className={className}>
    <Text className="text-base font-semibold text-gray-800 mb-3">Type</Text>
    <View className="flex-row bg-gray-200 rounded-xl p-1">
      <TouchableOpacity
        onPress={() => onChange('expense')}
        className={`flex-1 py-3 rounded-lg ${
          type === 'expense' ? 'bg-white' : 'bg-transparent'
        }`}
      >
        <View className="flex-row items-center justify-center">
          <Ionicons
            name="remove-circle"
            size={18}
            color={type === 'expense' ? '#EF4444' : '#6B7280'}
          />
          <Text
            className={`ml-2 font-semibold ${
              type === 'expense' ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            Expense
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onChange('income')}
        className={`flex-1 py-3 rounded-lg ${
          type === 'income' ? 'bg-white' : 'bg-transparent'
        }`}
      >
        <View className="flex-row items-center justify-center">
          <Ionicons
            name="add-circle"
            size={18}
            color={type === 'income' ? '#10B981' : '#6B7280'}
          />
          <Text
            className={`ml-2 font-semibold ${
              type === 'income' ? 'text-green-500' : 'text-gray-600'
            }`}
          >
            Income
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

export default TransactionTypeToggle;
