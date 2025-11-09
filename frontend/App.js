import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import DashboardScreen from "./screens/DashboardScreen";
import AuthCallbackScreen from "./screens/AuthCallbackScreen";
import { AuthProvider } from "./context/AuthContext";

import "./global.css";
import AddTransactionScreen from "./screens/AddTransactionScreen";

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
  return (
    <AuthProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          initialRouteName="Login"
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
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
