import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../common/Card';

/**
 * Transaction Item Component
 * Displays a single transaction with icon, details, and amount
 */
const TransactionItem = ({ transaction, onPress, onDelete, showDelete = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="p-4 mb-3">
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <Ionicons
                name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                size={16}
                color={transaction.type === 'credit' ? '#10B981' : '#EF4444'}
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-semibold text-gray-800">{transaction.title || transaction.description}</Text>
              <Text className="text-gray-500 text-sm">
                {transaction.category} • {transaction.date}
              </Text>
              {transaction.paymentMethod && (
                <Text className="text-gray-400 text-xs mt-1">{transaction.paymentMethod}</Text>
              )}
            </View>
          </View>
          <View className="items-end">
            <Text
              className={`font-bold ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {transaction.type === 'credit' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </Text>
            {showDelete && (
              <TouchableOpacity onPress={onDelete} className="mt-2 p-2">
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

export default TransactionItem;
