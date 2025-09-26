import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (username.toLowerCase() === "admin" && password === "password") {
        navigation.replace("Dashboard");
      } else {
        Alert.alert("Login Failed", "Invalid username or password");
      }
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View className="flex-1 justify-center items-center px-6">
          <View className="items-center mb-12">
            <View className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 justify-center items-center shadow-lg">
              <Ionicons name="wallet" size={64} color="white" />
            </View>
            <Text className="text-4xl font-bold text-gray-800 mb-2">Paisa Track</Text>
            <Text className="text-gray-600 text-center text-base">
              Track your UPI payments in one place
            </Text>
          </View>
          <View className="w-full max-w-sm">
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Username</Text>
              <View className={`flex-row items-center bg-white rounded-xl px-4 py-3 border ${errors.username ? 'border-red-400' : 'border-gray-200'} shadow-sm`}>
                <Ionicons name="person-outline" size={20} color="#6B7280" />
                <TextInput
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (errors.username) setErrors({...errors, username: null});
                  }}
                  placeholder="Enter your username"
                  className="flex-1 ml-3 text-gray-800 text-base"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.username && (
                <Text className="text-red-500 text-sm mt-1 ml-1">{errors.username}</Text>
              )}
            </View>
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Password</Text>
              <View className={`flex-row items-center bg-white rounded-xl px-4 py-3 border ${errors.password ? 'border-red-400' : 'border-gray-200'} shadow-sm`}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({...errors, password: null});
                  }}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  className="flex-1 ml-3 mr-3 text-gray-800 text-base"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="p-1"
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1 ml-1">{errors.password}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl py-4 shadow-lg ${isLoading ? 'opacity-70' : ''}`}
            >
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                )}
                <Text className="text-white font-bold text-lg">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </View>
            </TouchableOpacity>
            <View className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <Text className="text-yellow-800 font-semibold text-center mb-2">Demo Credentials</Text>
              <Text className="text-yellow-700 text-sm text-center">
                Username: <Text className="font-mono font-bold">admin</Text>
              </Text>
              <Text className="text-yellow-700 text-sm text-center">
                Password: <Text className="font-mono font-bold">password</Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
