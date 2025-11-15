import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Floating Action Button Component
 * Circular button that floats at the bottom right
 */
const FloatingActionButton = ({ 
  icon = 'add', 
  onPress, 
  color = 'bg-blue-500',
  className = '' 
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`${color} w-14 h-14 rounded-full items-center justify-center shadow-lg ${className}`}
    activeOpacity={0.8}
  >
    <Ionicons name={icon} size={24} color="white" />
  </TouchableOpacity>
);

export default FloatingActionButton;
