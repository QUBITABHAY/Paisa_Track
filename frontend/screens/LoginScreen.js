import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username && password) {
      navigation.replace("SignIn");
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-8">
        <View className="w-40 h-40 bg-blue-500 rounded-full mb-12"></View>
        <Text className="text-2xl font-bold text-blue-600 mb-8">Login</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 bg-white"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 bg-white"
        />
        <View className="bg-blue-500 rounded-lg">
          <Button title="Login" color="white" onPress={handleLogin} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
