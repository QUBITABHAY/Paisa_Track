import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable Input Component
 * Text input field with label, icon, and error handling
 */
const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  keyboardType,
  secureTextEntry,
  className = '',
  ...rest
}) => (
  <View className={`${className} mb-4`}>
    {label && <Text className="text-gray-700 font-semibold mb-2">{label}</Text>}
    <View
      className={`flex-row items-center bg-white rounded-xl px-4 py-3 border-2 ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-200'
      }`}
    >
      {icon && <Ionicons name={icon} size={20} color="#6B7280" />}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        className="flex-1 ml-3 text-gray-800"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        {...rest}
      />
    </View>
    {error && <Text className="text-red-500 text-sm mt-2 ml-1">{error}</Text>}
  </View>
);

export default Input;
