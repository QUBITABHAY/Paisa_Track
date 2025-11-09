import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const AuthCallbackScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { login } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Get parameters from URL
      const params = route.params || {};
      
      // Check for error
      if (params.error) {
        setStatus('error');
        setMessage(getErrorMessage(params.error));
        
        // Redirect to login after delay
        setTimeout(() => {
          navigation.replace('Login');
        }, 3000);
        return;
      }

      // Check for token and user data
      if (params.token && params.user) {
        setMessage('Saving your credentials...');
        
        // Parse user data if it's a string
        let userData = params.user;
        if (typeof userData === 'string') {
          try {
            userData = JSON.parse(decodeURIComponent(userData));
          } catch (e) {
            console.error('Error parsing user data:', e);
            throw new Error('Invalid user data received');
          }
        }

        // Login with the received data
        const result = await login(userData, params.token);

        if (result.success) {
          setStatus('success');
          setMessage(`Welcome back, ${userData.username || 'User'}!`);
          
          // Navigate to Dashboard after short delay
          setTimeout(() => {
            navigation.replace('Dashboard');
          }, 1500);
        } else {
          throw new Error(result.error || 'Failed to save login data');
        }
      } else {
        throw new Error('No authentication data received');
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      setStatus('error');
      setMessage(error.message || 'Authentication failed');
      
      // Redirect to login after delay
      setTimeout(() => {
        navigation.replace('Login');
      }, 3000);
    }
  };

  const getErrorMessage = (error) => {
    const errorMessages = {
      'authentication_failed': 'Authentication failed. Please try again.',
      'google_auth_failed': 'Google authentication failed. Please try again.',
      'server_error': 'Server error occurred. Please try again later.',
      'user_cancelled': 'You cancelled the sign-in process.',
    };

    return errorMessages[error] || 'An error occurred. Please try again.';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {status === 'processing' && (
          <>
            <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
            <Ionicons name="shield-checkmark-outline" size={80} color="#3b82f6" style={styles.icon} />
            <Text style={styles.title}>Completing Sign In</Text>
            <Text style={styles.message}>{message}</Text>
          </>
        )}

        {status === 'success' && (
          <>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color="#10b981" />
            </View>
            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.message}>{message}</Text>
          </>
        )}

        {status === 'error' && (
          <>
            <View style={styles.errorIcon}>
              <Ionicons name="close-circle" size={80} color="#ef4444" />
            </View>
            <Text style={styles.errorTitle}>Authentication Failed</Text>
            <Text style={styles.errorMessage}>{message}</Text>
            <Text style={styles.redirectText}>Redirecting to login...</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    maxWidth: 400,
  },
  loader: {
    marginBottom: 20,
  },
  icon: {
    marginBottom: 24,
    opacity: 0.8,
  },
  successIcon: {
    marginBottom: 24,
  },
  errorIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorMessage: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  redirectText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default AuthCallbackScreen;
