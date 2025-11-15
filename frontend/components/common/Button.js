import React from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable Button Component
 * Styled button with loading state and icon support
 */
const Button = ({
  title,
  onPress,
  loading,
  icon,
  size = 'medium',
  variant = 'primary',
  className = '',
  disabled,
}) => {
  const variantStyles = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    danger: 'bg-red-500',
    secondary: 'bg-gray-500',
    outline: 'bg-white border-2 border-blue-500',
  };

  const textStyles = {
    primary: 'text-white',
    success: 'text-white',
    danger: 'text-white',
    secondary: 'text-white',
    outline: 'text-blue-500',
  };

  const sizeStyles = {
    small: 'py-2 px-3',
    medium: 'py-3 px-4',
    large: 'py-4 px-6',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-2xl items-center justify-center ${className} ${
        (loading || disabled) ? 'opacity-50' : ''
      }`}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-center">
        {loading && <ActivityIndicator size="small" color="#fff" className="mr-2" />}
        {icon && !loading && <Ionicons name={icon} size={20} color={variant === 'outline' ? '#3B82F6' : '#fff'} />}
        <Text className={`${textStyles[variant]} font-semibold text-base ${icon ? 'ml-2' : ''}`}>
          {loading ? `${title}...` : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
