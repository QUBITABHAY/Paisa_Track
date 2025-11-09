import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const AddTransactionScreen = ({ navigation }) => {
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const expenseCategories = [
    { id: 'food', label: 'Food', icon: 'fast-food', color: '#FF6B6B' },
    { id: 'transport', label: 'Transport', icon: 'car', color: '#4ECDC4' },
    { id: 'shopping', label: 'Shopping', icon: 'cart', color: '#45B7D1' },
    { id: 'bills', label: 'Bills', icon: 'document-text', color: '#96CEB4' },
    { id: 'entertainment', label: 'Entertainment', icon: 'musical-notes', color: '#FFEAA7' },
    { id: 'health', label: 'Health', icon: 'medical', color: '#FD79A8' },
    { id: 'education', label: 'Education', icon: 'school', color: '#A29BFE' },
    { id: 'other', label: 'Other', icon: 'apps', color: '#636E72' },
  ];

  const incomeCategories = [
    { id: 'salary', label: 'Salary', icon: 'cash', color: '#00B894' },
    { id: 'freelance', label: 'Freelance', icon: 'laptop', color: '#6C5CE7' },
    { id: 'investment', label: 'Investment', icon: 'trending-up', color: '#0984E3' },
    { id: 'business', label: 'Business', icon: 'business', color: '#FDCB6E' },
    { id: 'gift', label: 'Gift', icon: 'gift', color: '#E17055' },
    { id: 'refund', label: 'Refund', icon: 'refresh', color: '#74B9FF' },
    { id: 'other', label: 'Other', icon: 'apps', color: '#636E72' },
  ];

  const paymentModes = ['UPI', 'Card', 'Cash', 'Net Banking', 'Wallet'];

  const activeCategories = transactionType === 'expense' ? expenseCategories : incomeCategories;

  const validateInputs = () => {
    const errors = {};

    if (!amount || parseFloat(amount) <= 0 || isNaN(amount)) {
      errors.amount = 'Enter a valid amount';
    }

    if (!description.trim()) {
      errors.description = 'Description is required';
    }

    if (!selectedCategory) {
      errors.category = 'Please select a category';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Transaction saved successfully!',
        [
          {
            text: 'Add Another',
            onPress: resetForm,
          },
          {
            text: 'Back to Dashboard',
            onPress: () => navigation.navigate('Dashboard'),
          },
        ]
      );
    }, 1000);
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setTransactionDate(new Date().toISOString().split('T')[0]);
    setPaymentMode('UPI');
    setFormErrors({});
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white px-5 py-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold text-gray-900 mr-6">
          Add Transaction
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-5">
          {/* Transaction Type Selector */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              Type
            </Text>
            <View className="flex-row bg-gray-200 rounded-xl p-1">
              <TouchableOpacity
                onPress={() => {
                  setTransactionType('expense');
                  setSelectedCategory('');
                  setFormErrors({});
                }}
                className={`flex-1 py-3 rounded-lg ${
                  transactionType === 'expense' ? 'bg-white' : 'bg-transparent'
                }`}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons
                    name="remove-circle"
                    size={18}
                    color={transactionType === 'expense' ? '#EF4444' : '#6B7280'}
                  />
                  <Text
                    className={`ml-2 font-semibold ${
                      transactionType === 'expense'
                        ? 'text-red-500'
                        : 'text-gray-600'
                    }`}
                  >
                    Expense
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setTransactionType('income');
                  setSelectedCategory('');
                  setFormErrors({});
                }}
                className={`flex-1 py-3 rounded-lg ${
                  transactionType === 'income' ? 'bg-white' : 'bg-transparent'
                }`}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons
                    name="add-circle"
                    size={18}
                    color={transactionType === 'income' ? '#10B981' : '#6B7280'}
                  />
                  <Text
                    className={`ml-2 font-semibold ${
                      transactionType === 'income'
                        ? 'text-green-500'
                        : 'text-gray-600'
                    }`}
                  >
                    Income
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Amount Input */}
          <View
            className={`mb-6 p-5 rounded-2xl ${
              transactionType === 'expense'
                ? 'bg-red-50 border border-red-200'
                : 'bg-green-50 border border-green-200'
            }`}
          >
            <Text className="text-base font-semibold text-gray-800 mb-3">
              Amount
            </Text>
            <View className="flex-row items-center">
              <Text
                className={`text-3xl font-bold mr-2 ${
                  transactionType === 'expense'
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                ₹
              </Text>
              <TextInput
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  if (formErrors.amount) {
                    setFormErrors({ ...formErrors, amount: null });
                  }
                }}
                placeholder="0"
                keyboardType="numeric"
                className={`flex-1 text-3xl font-bold ${
                  transactionType === 'expense'
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              />
            </View>
            {formErrors.amount && (
              <Text className="text-red-500 text-sm mt-2">
                {formErrors.amount}
              </Text>
            )}
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              Description
            </Text>
            <View
              className={`flex-row items-center bg-white px-4 py-3 rounded-xl border-2 ${
                formErrors.description ? 'border-red-400' : 'border-gray-200'
              }`}
            >
              <Ionicons name="text" size={20} color="#6B7280" />
              <TextInput
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (formErrors.description) {
                    setFormErrors({ ...formErrors, description: null });
                  }
                }}
                placeholder="What's this for?"
                className="flex-1 ml-3 text-gray-900"
              />
            </View>
            {formErrors.description && (
              <Text className="text-red-500 text-sm mt-2">
                {formErrors.description}
              </Text>
            )}
          </View>

          {/* Category */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              Category
            </Text>
            <View className="flex-row flex-wrap -mx-1">
              {activeCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    setSelectedCategory(cat.id);
                    if (formErrors.category) {
                      setFormErrors({ ...formErrors, category: null });
                    }
                  }}
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
                        selectedCategory === cat.id
                          ? 'text-blue-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {cat.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {formErrors.category && (
              <Text className="text-red-500 text-sm mt-2">
                {formErrors.category}
              </Text>
            )}
          </View>

          {/* Date */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              Date
            </Text>
            <View className="flex-row items-center bg-white px-4 py-3 rounded-xl border-2 border-gray-200">
              <Ionicons name="calendar" size={20} color="#6B7280" />
              <TextInput
                value={transactionDate}
                onChangeText={setTransactionDate}
                placeholder="YYYY-MM-DD"
                className="flex-1 ml-3 text-gray-900"
              />
            </View>
          </View>

          {/* Payment Mode */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              Payment Mode
            </Text>
            <View className="flex-row flex-wrap -mx-1">
              {paymentModes.map((mode) => (
                <TouchableOpacity
                  key={mode}
                  onPress={() => setPaymentMode(mode)}
                  className={`m-1 px-5 py-2 rounded-full border-2 ${
                    paymentMode === mode
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      paymentMode === mode ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {mode}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`py-4 rounded-2xl items-center ${
              transactionType === 'expense' ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white text-lg font-bold">
                {transactionType === 'expense' ? 'Add Expense' : 'Add Income'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTransactionScreen;