import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

class GoogleAuthService {
  constructor() {
    this.apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    this.appScheme = process.env.EXPO_PUBLIC_APP_SCHEME || 'paisatrack';
  }

  getGoogleAuthUrl() {
    return `${this.apiUrl}/api/auth/google?mobile=true`;
  }

  async signIn() {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        this.getGoogleAuthUrl(),
        `${this.appScheme}://auth/callback`,
        {
          dismissButtonStyle: 'close',
          showInRecents: false,
        }
      );

      if (result.type === 'success') {
        const { url } = result;
        const params = this.extractParamsFromUrl(url);

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

  extractParamsFromUrl(url) {
    const params = {};
    const urlObj = new URL(url);

    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  }

  async completeSignIn() {
    try {
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

  async signInWithPolling() {
    try {
      const authWindow = await WebBrowser.openBrowserAsync(
        this.getGoogleAuthUrl()
      );
      
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

  async linkAccount(userToken) {
    try {
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