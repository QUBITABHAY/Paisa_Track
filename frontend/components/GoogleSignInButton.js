import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import googleAuthService from '../services/googleAuthService';
import { useAuth } from '../context/AuthContext';

const GoogleSignInButton = ({ 
  onSuccess, 
  onError, 
  disabled = false, 
  style = {},
  textStyle = {},
  mode = 'signin' // 'signin', 'link', 'unlink'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, getAuthHeader, updateUser } = useAuth();

  const handlePress = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);

    try {
      let result;

      switch (mode) {
        case 'signin':
          // Trigger OAuth and get the result
          result = await googleAuthService.signIn();
          break;
        case 'link':
          const authHeader = getAuthHeader();
          const token = authHeader?.replace('Bearer ', '');
          result = await googleAuthService.linkAccount(token);
          break;
        case 'unlink':
          const authHeaderUnlink = getAuthHeader();
          const tokenUnlink = authHeaderUnlink?.replace('Bearer ', '');
          result = await googleAuthService.unlinkAccount(tokenUnlink);
          break;
        default:
          throw new Error('Invalid mode specified');
      }

      if (result.success) {
        if (mode === 'signin') {
          // Process the login with received token and user
          if (result.token && result.user) {
            await login(result.user, result.token);
            console.log('Login saved, calling onSuccess');
            onSuccess?.(result);
          } else {
            throw new Error('No token or user data received');
          }
        } else if (mode === 'link') {
          // Handle account linking
          if (result.data?.user) {
            await updateUser(result.data.user);
          }
          Alert.alert('Success', 'Google account linked successfully');
          onSuccess?.(result);
        } else if (mode === 'unlink') {
          // Handle account unlinking
          if (result.data?.user) {
            await updateUser(result.data.user);
          }
          Alert.alert('Success', 'Google account unlinked successfully');
          onSuccess?.(result);
        }
      } else {
        const errorMessage = result.error || 'Authentication failed';
        Alert.alert('Error', errorMessage);
        onError?.(result);
      }
    } catch (error) {
      console.error('Google Auth Button Error:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      Alert.alert('Error', errorMessage);
      onError?.({ success: false, error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      switch (mode) {
        case 'signin': return 'Signing in...';
        case 'link': return 'Linking account...';
        case 'unlink': return 'Unlinking account...';
        default: return 'Processing...';
      }
    }

    switch (mode) {
      case 'signin': return 'Continue with Google';
      case 'link': return 'Link Google Account';
      case 'unlink': return 'Unlink Google Account';
      default: return 'Continue with Google';
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor: 'white',
      borderWidth: 2,
      borderColor: '#e5e7eb',
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2
    };

    if (mode === 'unlink') {
      return {
        ...baseStyle,
        backgroundColor: '#fee2e2',
        borderColor: '#fca5a5'
      };
    }

    return baseStyle;
  };

  const getTextColor = () => {
    return mode === 'unlink' ? '#dc2626' : '#374151';
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || isLoading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {!isLoading && (
          <View style={{ width: 20, height: 20, marginRight: 12 }}>
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
        )}
        
        {isLoading && (
          <View style={{ 
            width: 20, 
            height: 20, 
            borderWidth: 2, 
            borderColor: '#e5e7eb', 
            borderTopColor: '#3b82f6',
            borderRadius: 10,
            marginRight: 12
          }} />
        )}
        
        <Text 
          style={[
            {
              color: getTextColor(),
              fontSize: 16,
              fontWeight: '600'
            },
            textStyle
          ]}
        >
          {getButtonText()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;