import React, { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";

const SigninScreen = ({ navigation }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [email, setEmail] = useState();

  const handleLogin = () => {
    alert("Sucess");
  };

  return (
    <View className="flex-1 justify-center items-center px-8">
      <View className="w-40 h-40 bg-blue-500 rounded-full mb-12"></View>
      <Text className="text-2xl font-bold text-blue-600 mb-8">SignIn</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        className="w-full border border-gray-300 rounded-lg p-3 mb-4 bg-white"
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        className="w-full border border-gray-300 rounded-lg p-3 mb-4 bg-white"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        className="w-full border border-gray-300 rounded-lg p-3 mb-6 bg-white"
      />
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirm Password"
        className="w-full border border-gray-300 rounded-lg p-3 mb-6 bg-white"
      />
      <View className="bg-blue-500 rounded-lg">
        <Button title="SignIn" color="white" onPress={handleLogin} />
      </View>
    </View>
  );
};

export default SigninScreen;
