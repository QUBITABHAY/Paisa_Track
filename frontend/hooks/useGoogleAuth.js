import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import googleAuthService from '../services/googleAuthService';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, getAuthHeader, updateUser } = useAuth();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await googleAuthService.completeSignIn();
      
      if (result.success) {
        await login(result.user, result.token);
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Google sign-in failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const linkGoogleAccount = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        throw new Error('No authentication token found');
      }

      const token = authHeader.replace('Bearer ', '');
      const result = await googleAuthService.linkAccount(token);
      
      if (result.success) {
        if (result.data?.user) {
          await updateUser(result.data.user);
        }
        return { success: true, user: result.data?.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to link Google account';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeader, updateUser]);

  const unlinkGoogleAccount = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        throw new Error('No authentication token found');
      }

      const token = authHeader.replace('Bearer ', '');
      const result = await googleAuthService.unlinkAccount(token);
      
      if (result.success) {
        if (result.data?.user) {
          await updateUser(result.data.user);
        }
        return { success: true, user: result.data?.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to unlink Google account';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeader, updateUser]);

  return {
    isLoading,
    error,
    clearError,
    signInWithGoogle,
    linkGoogleAccount,
    unlinkGoogleAccount
  };
};

export default useGoogleAuth;