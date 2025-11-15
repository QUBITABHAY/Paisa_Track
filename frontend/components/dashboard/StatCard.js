import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../common/Card';

/**
 * Stat Card Component
 * Displays a statistic with icon, title, value, and subtitle
 */
const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => {
  const colorMap = {
    blue: { bg: 'bg-blue-100', icon: '#3B82F6' },
    green: { bg: 'bg-green-100', icon: '#10B981' },
    red: { bg: 'bg-red-100', icon: '#EF4444' },
    purple: { bg: 'bg-purple-100', icon: '#8B5CF6' },
    yellow: { bg: 'bg-yellow-100', icon: '#F59E0B' },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <Card className="flex-1 mx-1">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-600 text-sm font-medium">{title}</Text>
        <View className={`w-8 h-8 ${colors.bg} rounded-full items-center justify-center`}>
          <Ionicons name={icon} size={16} color={colors.icon} />
        </View>
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-1">{value}</Text>
      <Text className="text-gray-500 text-xs">{subtitle}</Text>
    </Card>
  );
};

export default StatCard;
