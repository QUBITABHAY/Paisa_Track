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
import Svg, { Path } from "react-native-svg";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const API_URL = "http://localhost:3000/api/user/register";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      } else {
        Alert.alert("Registration Failed", data.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Registration error:", error);
      Alert.alert("Error", "Network error. Please try again later.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 24,
              paddingTop: 40,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-3xl mb-3 justify-center items-center">
                <Ionicons name="person-add-outline" size={40} color="blue" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                Create Account
              </Text>
              <Text className="text-gray-600 text-center text-sm leading-5">
                Join Paisa Track to manage your finances
              </Text>
            </View>

            <View className="w-full max-w-sm mx-auto">
              <View className="mb-3">
                <Text className="text-gray-700 font-semibold mb-2 text-base">
                  Username
                </Text>
                <View
                  className={`flex-row items-center bg-white rounded-xl px-4 py-4 border-2 ${errors.username ? "border-red-400 bg-red-50" : "border-gray-200"} shadow-sm`}
                >
                  <Ionicons name="person-outline" size={22} color="#6B7280" />
                  <TextInput
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      if (errors.username)
                        setErrors({ ...errors, username: null });
                    }}
                    placeholder="Enter your username"
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-3 text-gray-800 text-base"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
                {errors.username && (
                  <Text className="text-red-500 text-sm mt-2 ml-1 font-medium">
                    {errors.username}
                  </Text>
                )}
              </View>

              <View className="mb-3">
                <Text className="text-gray-700 font-semibold mb-2 text-base">
                  Email
                </Text>
                <View
                  className={`flex-row items-center bg-white rounded-xl px-4 py-4 border-2 ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"} shadow-sm`}
                >
                  <Ionicons name="mail-outline" size={22} color="#6B7280" />
                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors({ ...errors, email: null });
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
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-2 ml-1 font-medium">
                    {errors.email}
                  </Text>
                )}
              </View>

              <View className="mb-3">
                <Text className="text-gray-700 font-semibold mb-2 text-base">
                  Password
                </Text>
                <View
                  className={`flex-row items-center bg-white rounded-xl px-4 py-4 border-2 ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200"} shadow-sm`}
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
                    returnKeyType="next"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-2"
                    activeOpacity={0.7}
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

              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2 text-base">
                  Confirm Password
                </Text>
                <View
                  className={`flex-row items-center bg-white rounded-xl px-4 py-4 border-2 ${errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-200"} shadow-sm`}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={22}
                    color="#6B7280"
                  />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword)
                        setErrors({ ...errors, confirmPassword: null });
                    }}
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1 ml-3 mr-3 text-gray-800 text-base"
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSignUp}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-2"
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={22}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text className="text-red-500 text-sm mt-2 ml-1 font-medium">
                    {errors.confirmPassword}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={handleSignUp}
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
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Text>
                </View>
              </TouchableOpacity>

              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-4 text-gray-500 text-sm font-medium">
                  OR
                </Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

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
              
              <View className="flex-row justify-center mt-4">
                <Text className="text-gray-600 text-base">
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text className="text-blue-600 font-semibold text-base">
                    Sign In
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

export default SignUpScreen;
