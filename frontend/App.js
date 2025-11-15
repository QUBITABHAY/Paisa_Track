import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import DashboardScreen from "./screens/DashboardScreen";
import AuthCallbackScreen from "./screens/AuthCallbackScreen";
import { AuthProvider } from "./context/AuthContext";

import "./global.css";
import AddTransactionScreen from "./screens/AddTransactionScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import AnalyticsScreen from "./screens/AnaliticsScreen";

const Stack = createNativeStackNavigator();

// Deep linking configuration
const linking = {
  prefixes: ['paisatrack://', 'https://paisatrack.app'],
  config: {
    screens: {
      Login: 'login',
      SignUp: 'signup',
      AuthCallback: {
        path: 'auth/callback',
        parse: {
          token: (token) => token,
          user: (user) => {
            try {
              return typeof user === 'string' ? JSON.parse(decodeURIComponent(user)) : user;
            } catch {
              return user;
            }
          },
          error: (error) => error,
        },
      },
      Dashboard: 'dashboard',
      AddTransaction: 'add-transaction',
    },
  },
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const user = await AsyncStorage.getItem('auth_user');
      
      if (token && user) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // or a loading screen
  }

  return (
    <AuthProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "Dashboard" : "Login"}
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="AuthCallback" component={AuthCallbackScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
          <Stack.Screen name="Transactions" component={TransactionsScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
