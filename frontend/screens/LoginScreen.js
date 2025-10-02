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
import Svg, { Path } from 'react-native-svg';

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

      if (username.toLowerCase() === "admin" && password === "password") {
        Alert.alert("Demo Login", "Logged in with demo credentials", [
          {
            text: "OK",
            onPress: () => navigation.replace("homepage"), // change
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          "Network error. Try demo credentials (admin/password)"
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
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
                    <View
                      className="flex-row items-center justify-center"
                      style={{
                        transform: [{ rotate: isLoading ? "360deg" : "0deg" }],
                      }}
                    />
                  )}
                  <Text className="text-gray-700 font-semibold text-base ml-3">
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

              {/* Google */}
              <TouchableOpacity
                              className="bg-white border-2 border-gray-200 rounded-2xl py-4 px-6 shadow-sm"
                              activeOpacity={0.8}
                            >
                              <View className="flex-row items-center justify-center">
                                <View className="w-5 h-5 mr-3">
                                  <Svg viewBox="0 0 48 48" width="20" height="20">
                                    <Path 
                                      fill="#EA4335" 
                                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                    />
                                    <Path 
                                      fill="#4285F4" 
                                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                    />
                                    <Path 
                                      fill="#FBBC05" 
                                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                    />
                                    <Path 
                                      fill="#34A853" 
                                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                    />
                                    <Path fill="none" d="M0 0h48v48H0z" />
                                  </Svg>
                                </View>
                                <Text className="text-gray-700 font-semibold text-base">
                                  Continue with Google
                                </Text>
                              </View>
                            </TouchableOpacity>

              {/* Sign Up */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600 text-base">
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
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
