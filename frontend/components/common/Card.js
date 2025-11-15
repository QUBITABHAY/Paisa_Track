import React from 'react';
import { View } from 'react-native';

/**
 * Reusable Card Component
 * A styled container with rounded corners, shadow, and border
 */
const Card = ({ children, className = '' }) => (
  <View className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`}>
    {children}
  </View>
);

export default Card;
