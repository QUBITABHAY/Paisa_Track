import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Category Selector Component
 * Grid of selectable categories with icons and colors
 */
const CategorySelector = ({ 
  categories, 
  selectedCategory, 
  onSelect, 
  error 
}) => (
  <View className="mb-6">
    <Text className="text-base font-semibold text-gray-800 mb-3">Category</Text>
    <View className="flex-row flex-wrap -mx-1">
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => onSelect(cat.id)}
          className={`m-1 p-3 rounded-xl border-2 ${
            selectedCategory === cat.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <View className="items-center w-16">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: cat.color + '30' }}
            >
              <Ionicons name={cat.icon} size={22} color={cat.color} />
            </View>
            <Text
              className={`text-xs font-medium text-center ${
                selectedCategory === cat.id ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {cat.label || cat.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
    {error && <Text className="text-red-500 text-sm mt-2">{error}</Text>}
  </View>
);

export default CategorySelector;
