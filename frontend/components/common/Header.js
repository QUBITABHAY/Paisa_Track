import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Header Component
 * Reusable header with back button, title, and optional right action
 */
const Header = ({ 
  title, 
  onBack, 
  rightIcon, 
  onRightPress, 
  showBack = true,
  className = '' 
}) => (
  <View className={`bg-white px-5 py-4 flex-row items-center justify-between border-b border-gray-200 ${className}`}>
    {showBack ? (
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>
    ) : (
      <View className="w-6" />
    )}
    <Text className="text-xl font-bold text-gray-900">{title}</Text>
    {rightIcon ? (
      <TouchableOpacity onPress={onRightPress}>
        <Ionicons name={rightIcon} size={24} color="#3B82F6" />
      </TouchableOpacity>
    ) : (
      <View className="w-6" />
    )}
  </View>
);

export default Header;
