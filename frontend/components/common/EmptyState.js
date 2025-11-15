import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Empty State Component
 * Displays when there's no data to show
 */
const EmptyState = ({ icon, title, subtitle, actionButton }) => (
  <View className="items-center justify-center py-16 px-6">
    <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
      <Ionicons name={icon} size={40} color="#9CA3AF" />
    </View>
    <Text className="text-xl font-bold text-gray-800 mb-2 text-center">{title}</Text>
    <Text className="text-gray-500 text-center mb-6">{subtitle}</Text>
    {actionButton}
  </View>
);

export default EmptyState;
