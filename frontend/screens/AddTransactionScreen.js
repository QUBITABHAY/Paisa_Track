import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";


const Card = ({ children, className = '' }) => (
  <View className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`}>
    {children}
  </View>
);

const Input = ({ label, value, onChangeText, placeholder, icon, error, keyboardType, className = '', ...rest }) => (
  <View className={`${className} mb-4`}>
    {label && <Text className="text-gray-700 font-semibold mb-2">{label}</Text>}
    <View className={`flex-row items-center bg-white rounded-xl px-4 py-3 border-2 ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
      {icon && <Ionicons name={icon} size={20} color="#6B7280" />}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        className="flex-1 ml-3 text-gray-800"
        keyboardType={keyboardType}
        {...rest}
      />
    </View>
    {error && <Text className="text-red-500 text-sm mt-2 ml-1">{error}</Text>}
  </View>
);

const Button = ({ title, onPress, loading, icon, size = 'medium', className = '' }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    className={`bg-blue-500 rounded-2xl py-3 px-4 items-center justify-center ${className}`}
    activeOpacity={0.8}
  >
    <View className="flex-row items-center justify-center">
      {loading && (
        <ActivityIndicator size="small" color="#fff" className="mr-2" />
      )}
      <Text className="text-white font-semibold">{loading ? `${title}...` : title}</Text>
    </View>
  </TouchableOpacity>
);

const AddTransactionScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    type: "debit", // debit or credit
    paymentMethod: "UPI",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: "food", name: "Food & Dining", icon: "restaurant", color: "#FF6B6B" },
    { id: "transport", name: "Transport", icon: "car", color: "#4ECDC4" },
    { id: "shopping", name: "Shopping", icon: "bag", color: "#45B7D1" },
    { id: "bills", name: "Bills & Utilities", icon: "receipt", color: "#96CEB4" },
    { id: "entertainment", name: "Entertainment", icon: "game-controller", color: "#FFEAA7" },
    { id: "health", name: "Health & Fitness", icon: "fitness", color: "#FD79A8" },
    { id: "education", name: "Education", icon: "book", color: "#A29BFE" },
    { id: "income", name: "Income", icon: "trending-up", color: "#00B894" },
    { id: "other", name: "Other", icon: "ellipsis-horizontal", color: "#636E72" },
  ];

  const paymentMethods = ["UPI", "Card", "Cash", "Net Banking", "Wallet"];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Success",
        "Transaction added successfully!",
        [
          {
            text: "Add Another",
            onPress: () => {
              setFormData({
                amount: "",
                description: "",
                category: "",
                date: new Date().toISOString().split('T')[0],
                type: "debit",
                paymentMethod: "UPI",
              });
              setErrors({});
            },
          },
          {
            text: "Go to Dashboard",
            onPress: () => navigation.navigate("Dashboard"),
          },
        ]
      );
    }, 1000);
  };

  const CategorySelector = () => (
    <View className="mb-6">
      <Text className="text-gray-700 font-semibold mb-3">Category</Text>
      <View className="flex-row flex-wrap">
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => {
              setFormData({ ...formData, category: category.id });
              if (errors.category) setErrors({ ...errors, category: null });
            }}
            className={`mr-3 mb-3 p-3 rounded-xl border-2 ${
              formData.category === category.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <View className="items-center">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: category.color + "20" }}
              >
                <Ionicons
                  name={category.icon}
                  size={20}
                  color={category.color}
                />
              </View>
              <Text
                className={`text-xs font-medium ${
                  formData.category === category.id ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {errors.category && (
        <Text className="text-red-500 text-sm mt-1">{errors.category}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Add Transaction</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        {/* Transaction Type Selector */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-3">Transaction Type</Text>
          <View className="flex-row bg-gray-100 rounded-xl p-1">
            <TouchableOpacity
              onPress={() => setFormData({ ...formData, type: "debit" })}
              className={`flex-1 py-3 rounded-lg ${
                formData.type === "debit" ? "bg-white shadow-sm" : ""
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  formData.type === "debit" ? "text-red-600" : "text-gray-600"
                }`}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFormData({ ...formData, type: "credit" })}
              className={`flex-1 py-3 rounded-lg ${
                formData.type === "credit" ? "bg-white shadow-sm" : ""
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  formData.type === "credit" ? "text-green-600" : "text-gray-600"
                }`}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Amount Input */}
        <Card className="p-4 mb-6">
          <Text className="text-gray-700 font-semibold mb-3">Amount</Text>
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold text-gray-800 mr-2">₹</Text>
            <Input
              value={formData.amount}
              onChangeText={(text) => {
                setFormData({ ...formData, amount: text });
                if (errors.amount) setErrors({ ...errors, amount: null });
              }}
              placeholder="0"
              keyboardType="numeric"
              error={errors.amount}
              className="flex-1 text-2xl font-bold"
            />
          </View>
        </Card>

        {/* Description */}
        <Input
          label="Description"
          value={formData.description}
          onChangeText={(text) => {
            setFormData({ ...formData, description: text });
            if (errors.description) setErrors({ ...errors, description: null });
          }}
          placeholder="Enter transaction description"
          icon="document-text-outline"
          error={errors.description}
        />

        {/* Category Selector */}
        <CategorySelector />

        {/* Date */}
        <Input
          label="Date"
          value={formData.date}
          onChangeText={(text) => setFormData({ ...formData, date: text })}
          placeholder="YYYY-MM-DD"
          icon="calendar-outline"
        />

        {/* Payment Method */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-3">Payment Method</Text>
          <View className="flex-row flex-wrap">
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method}
                onPress={() => setFormData({ ...formData, paymentMethod: method })}
                className={`mr-3 mb-3 px-4 py-2 rounded-full border-2 ${
                  formData.paymentMethod === method
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Text
                  className={`font-medium ${
                    formData.paymentMethod === method ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <Button
          title="Save Transaction"
          onPress={handleSave}
          loading={isLoading}
          icon="checkmark"
          size="large"
        />

        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTransactionScreen;