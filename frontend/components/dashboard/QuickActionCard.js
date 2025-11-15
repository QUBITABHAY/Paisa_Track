import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Quick Action Card Component
 * Clickable card for quick actions on dashboard
 */
const QuickActionCard = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  color = 'blue' 
}) => {
  const colorMap = {
    blue: { bg: 'bg-blue-100', icon: '#3B82F6' },
    green: { bg: 'bg-green-100', icon: '#10B981' },
    purple: { bg: 'bg-purple-100', icon: '#8B5CF6' },
    red: { bg: 'bg-red-100', icon: '#EF4444' },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 mx-1"
      activeOpacity={0.7}
    >
      <View className={`w-12 h-12 ${colors.bg} rounded-full items-center justify-center mb-3`}>
        <Ionicons name={icon} size={24} color={colors.icon} />
      </View>
      <Text className="font-bold text-gray-800 text-sm">{title}</Text>
      <Text className="text-gray-500 text-xs">{subtitle}</Text>
    </TouchableOpacity>
  );
};

export default QuickActionCard;
