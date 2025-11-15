import React from 'react';
import { View, Text } from 'react-native';
import Card from '../common/Card';

/**
 * Category Breakdown Component
 * Shows spending by category with progress bars
 */
const CategoryBreakdown = ({ 
  categories, 
  formatCurrency 
}) => (
  <Card>
    {categories.length > 0 ? (
      categories.map((category, index) => (
        <View key={index} className="mb-4 last:mb-0">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-semibold text-gray-800">{category.name}</Text>
            <Text className="text-gray-600">{formatCurrency(category.amount)}</Text>
          </View>
          <View className="bg-gray-200 rounded-full h-2">
            <View
              className="h-2 rounded-full"
              style={{
                width: `${category.percentage}%`,
                backgroundColor: category.color,
              }}
            />
          </View>
        </View>
      ))
    ) : (
      <Text className="text-gray-400 text-center py-4">No spending data available</Text>
    )}
  </Card>
);

export default CategoryBreakdown;
