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
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import GoogleSignInButton from '../components/GoogleSignInButton';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const screenHeight = Dimensions.get("window").height;

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      newErrors.username = "Please enter a valid email address";
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

    try {
      const API_URL = "http://localhost:3000/api/user/login";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        console.log("Login successful:", data.data.user);
        Alert.alert("Success", "Welcome back!", [
          {
            text: "OK",
            onPress: () => navigation.replace("Dashboard"),
          },
        ]);
      } else {
        Alert.alert("Login Failed", data.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);

      if (username.toLowerCase() === "test@test.com" && password === "testpass123") {
        Alert.alert("Demo Login", "Logged in with demo credentials", [
          {
            text: "OK",
            onPress: () => navigation.replace("Dashboard"),
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          "Network error. Try demo credentials (test@test.com/testpass123)"
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              minHeight: screenHeight * 0.85,
              justifyContent: "center",
              paddingHorizontal: 24,
              paddingVertical: 20,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View className="items-center mb-8">
              <View className="w-28 h-28 rounded-3xl mb-4 justify-center items-center">
                <Ionicons name="wallet-outline" size={56} color="blue" />
              </View>
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                Paisa Track
              </Text>
              <Text className="text-gray-600 text-center text-base leading-5">
                Track your UPI payments in one place
              </Text>
            </View>

            {/* Login Form */}
            <View className="w-full max-w-sm mx-auto">
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2 text-base">
                  Email
                </Text>
                <View
                  className={`flex-row items-center bg-white rounded-xl px-4 py-4 border-2 ${errors.username ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"} shadow-sm`}
                >
                  <Ionicons name="mail-outline" size={22} color="#6B7280" />
                  <TextInput
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      if (errors.username)
                        setErrors({ ...errors, username: null });
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-3 text-gray-800 text-base"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    returnKeyType="next"
                  />
                </View>
                {errors.username && (
                  <Text className="text-red-500 text-sm mt-2 ml-1 font-medium">
                    {errors.username}
                  </Text>
                )}
              </View>
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-2 text-base">
                  Password
                </Text>
                <View
                  className={`flex-row items-center bg-white rounded-xl px-4 py-4 border-2 ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"} shadow-sm`}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color="#6B7280"
                  />
                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password)
                        setErrors({ ...errors, password: null });
                    }}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    className="flex-1 ml-3 mr-3 text-gray-800 text-base"
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-2 -mr-1"
                    activeOpacity={0.6}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-2 ml-1 font-medium">
                    {errors.password}
                  </Text>
                )}
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="self-end mb-6">
                <Text className="text-blue-600 font-medium text-sm">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                className="bg-white border-2 border-gray-200 rounded-2xl py-4 px-6 shadow-sm"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-center">
                  {isLoading && (
                    <View className="mr-2">
                      <Ionicons name="refresh-outline" size={20} color="#374151" />
                    </View>
                  )}
                  <Text className="text-gray-700 font-semibold text-base">
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-4 text-gray-500 text-sm font-medium">
                  OR
                </Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* Google Sign In Button */}
              <GoogleSignInButton
                mode="signin"
                onSuccess={(result) => {
                  console.log('Google sign-in successful, navigating to Dashboard');
                  // Navigate to Dashboard after successful login
                  navigation.replace('Dashboard');
                }}
                onError={(error) => {
                  console.error('Google sign-in error:', error);
                }}
              />

              {/* Sign Up */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600 text-base">
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text className="text-blue-600 font-semibold text-base">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
