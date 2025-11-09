import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

class GoogleAuthService {
  constructor() {
    // Backend API URL
    this.apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    this.appScheme = process.env.EXPO_PUBLIC_APP_SCHEME || 'paisatrack';
  }

  // Get the OAuth URL from backend
  getGoogleAuthUrl() {
    // Add mobile=true parameter to ensure backend redirects to app scheme
    return `${this.apiUrl}/api/auth/google?mobile=true`;
  }

  // Perform Google sign-in using backend Passport.js
  async signIn() {
    try {
      console.log('Starting Google OAuth with backend...');
      console.log('Auth URL:', this.getGoogleAuthUrl());
      console.log('Redirect URL:', `${this.appScheme}://auth/callback`);
      
      // Open the backend's Google OAuth endpoint in browser
      // The redirect URI tells the browser where to return after OAuth
      const result = await WebBrowser.openAuthSessionAsync(
        this.getGoogleAuthUrl(),
        `${this.appScheme}://auth/callback`,
        {
          // Automatically dismiss browser when redirect happens
          dismissButtonStyle: 'close',
          showInRecents: false,
        }
      );

      console.log('OAuth result:', result);
      console.log('OAuth result type:', result.type);

      // When result.type is 'success', it means the browser captured the redirect
      // The URL will contain our token and user data
      if (result.type === 'success') {
        const { url } = result;
        console.log('Success URL:', url);
        
        // Extract params from the returned URL
        const params = this.extractParamsFromUrl(url);
        console.log('Extracted params:', params);

        if (params.token && params.user) {
          return {
            success: true,
            token: params.token,
            user: typeof params.user === 'string' ? JSON.parse(decodeURIComponent(params.user)) : params.user
          };
        } else if (params.error) {
          return {
            success: false,
            error: params.error
          };
        } else {
          return {
            success: false,
            error: 'No authentication data received'
          };
        }
      } else if (result.type === 'cancel') {
        return {
          success: false,
          error: 'User cancelled the sign-in process'
        };
      } else {
        return {
          success: false,
          error: 'Authentication failed'
        };
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  }

  // Extract parameters from callback URL
  extractParamsFromUrl(url) {
    const params = {};
    const urlObj = new URL(url);
    
    // Get parameters from query string
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  }

  // Complete Google sign-in process (uses backend Passport.js)
  async completeSignIn() {
    try {
      // The backend handles everything through Passport.js
      const result = await this.signIn();
      
      if (result.success) {
        return {
          success: true,
          user: result.user,
          token: result.token
        };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Complete sign-in error:', error);
      return {
        success: false,
        error: 'Sign-in process failed'
      };
    }
  }

  // Alternative method: Polling for auth completion (for platforms where deep linking is complex)
  async signInWithPolling() {
    try {
      console.log('Starting Google OAuth with polling...');
      
      // Open the backend's Google OAuth endpoint
      const authWindow = await WebBrowser.openBrowserAsync(
        this.getGoogleAuthUrl()
      );

      // Note: For polling to work, you'd need a backend endpoint 
      // to check auth status. This is a simplified version.
      // In production, implement proper deep linking instead.
      
      return {
        success: false,
        error: 'Please use deep linking for OAuth. See documentation.'
      };
    } catch (error) {
      console.error('OAuth polling error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Link Google account to existing user
  async linkAccount(userToken) {
    try {
      console.log('Linking Google account...');
      
      // For linking, we need to pass the current user's token and mobile parameter
      // Open OAuth with a state parameter containing the token
      const authUrl = `${this.apiUrl}/api/auth/google?mobile=true&state=${encodeURIComponent(JSON.stringify({ mode: 'link', token: userToken }))}`;
      
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        `${this.appScheme}://auth/callback`
      );

      if (result.type === 'success') {
        const params = this.extractParamsFromUrl(result.url);
        
        if (params.error) {
          return { success: false, error: params.error };
        }

        return { 
          success: true, 
          message: 'Google account linked successfully',
          data: params.user ? { user: JSON.parse(decodeURIComponent(params.user)) } : null
        };
      }

      return {
        success: false,
        error: 'Failed to link Google account'
      };
    } catch (error) {
      console.error('Link account error:', error);
      return {
        success: false,
        error: 'Failed to link Google account'
      };
    }
  }

  // Unlink Google account
  async unlinkAccount(userToken) {
    try {
      const response = await fetch(`${this.apiUrl}/api/auth/unlink-google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Unlink account error:', error);
      return {
        success: false,
        error: 'Failed to unlink Google account'
      };
    }
  }
}

export default new GoogleAuthService();